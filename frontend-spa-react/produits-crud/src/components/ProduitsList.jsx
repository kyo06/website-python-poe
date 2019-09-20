import React, { Component } from 'react';

const SERVER_URL = 'http://localhost:5000'
const API_URL = SERVER_URL + '/api'
const STATIC_URL = SERVER_URL + '/static'

class ProduitsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "data": [],
      "message": "",
      "nom_produit_add": "",
      "qty_produit_add": 0,
      "prix_produit_add": 0,

      "display_update_form": false,
      "id_produit_update": 0,
      "nom_produit_update": "",
      "qty_produit_update": 0,
      "prix_produit_update": 0
    };

    //this.props = { handleLogout: FunctionObject };
    //avec un seul hangleFormChange : OK
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
  }

  componentDidMount() {
    this.getListProduits();
  }

  getListProduits() {
    let handleLogout = this.props.handleLogout;

    return fetch(API_URL + '/produits', {
      method: 'GET',
      headers: {
        'Authorization': window.sessionStorage["token"],
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(response.status)
      }
      return response.json();
    }).then(data => this.setState({ "data": data }))
      .catch(function (response) {
        ///if status code 401...
        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
        window.sessionStorage.clear();
        handleLogout();
      });
  }

  supprimerProduit(id) {
    let handleLogout = this.props.handleLogout;

    return fetch(API_URL + '/produits/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': window.sessionStorage["token"],
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.status)
        }
        return response.json();
      })
      .then(data => {
        this.setState({ "message": data.message });
        this.getListProduits();
      }).catch(function (response) {
        ///if status code 401...
        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
        window.sessionStorage.clear();
        handleLogout();
      });
  }

  modifierProduit(id) {

    let nom_produit = this.state.nom_produit_update;
    let image_produit = document.querySelector("#image_produit_update").files[0]; //Info + Contenu du fichier
    let qty_produit = this.state.qty_produit_update;
    let prix_produit = this.state.prix_produit_update;

    let formData = new FormData();
    formData.append('nom_produit', nom_produit);
    formData.append('image_produit', image_produit);
    formData.append('qty_produit', qty_produit);
    formData.append('prix_produit', prix_produit);

    let handleLogout = this.props.handleLogout;

    return fetch(API_URL + '/produits/' + id,
      {
        method: 'PUT',
        headers: {
          'Authorization': window.sessionStorage["token"]
        },
        body: formData
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(response.status)
        }
        return response.json();
      })
      .then(data => {
        this.setState({ "message": data.message });
        this.getListProduits().then(() => {
          this.setState({
            "display_update_form": false,
            "id_produit_update": 0,
            "nom_produit_update": "",
            "qty_produit_update": 0,
            "prix_produit_update": 0
          });
        });
      }).catch(function (response) {
        ///if status code 401...
        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
        if (response.status == 401) {
          window.sessionStorage.clear();

          this.setState({ "message": 'Pas authorisé, vous allez être redirigé...' });
          handleLogout();

        } else {
          this.setState({ "message": 'Problème de modification du produit' });
        }
      });
  }

  ajouterProduit() {

    let nom_produit = this.state.nom_produit_add;
    let image_produit = document.querySelector("#image_produit_add").files[0]; //Info + Contenu du fichier
    let qty_produit = this.state.qty_produit_add;
    let prix_produit = this.state.prix_produit_add;

    let data = new FormData();
    data.append('nom_produit', nom_produit);
    data.append('image_produit', image_produit);
    data.append('qty_produit', qty_produit);
    data.append('prix_produit', prix_produit);

    let handleLogout = this.props.handleLogout;

    return fetch(API_URL + '/produits',
      {
        method: 'POST',
        headers: {
          'Authorization': window.sessionStorage["token"]
        },
        body: data
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(response)
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({ "message": data.message });
        return this.getListProduits();
      }).catch(function (response) {
        ///if status code 401...
        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
        if (response.status == 401) {
          window.sessionStorage.clear();

          this.setState({ "message": 'Pas authorisé, vous allez être redirigé...' });
          handleLogout();

        } else {
          this.setState({ "message": 'Problème de création du produit' });
        }
      });

  }

  handleDeleteClick = (id, e) => {
    e.preventDefault();
    console.log('The link was clicked.');
    this.supprimerProduit(id);

    //Cacher le formulaire d'update si on a supprimé le produit sélectionné
    if (id == this.state.id_produit_update) {
      this.setState({
        "display_update_form": false,
        "id_produit_update": 0,
        "nom_produit_update": "",
        "qty_produit_update": 0,
        "prix_produit_update": 0
      });
    }

  };

  handleUpdateClick = (id, e) => {
    e.preventDefault();
    console.log('The link was clicked.');
    this.modifierProduit(id);
  };

  handleAddClick = (e) => {
    e.preventDefault();
    this.ajouterProduit();
  };

  handleDisplayFormUpdateClick = (id, e) => {
    e.preventDefault();
    for (let index_produit in this.state.data) {
      let produit = this.state.data[index_produit];
      console.log(produit)
      if (produit['id'] == id) {
        this.setState({
          display_update_form: true,
          id_produit_update: id,
          nom_produit_update: produit['nom'],
          qty_produit_update: produit['qty'],
          prix_produit_update: produit['prix']
        });
        break;
      }
    }
  };

  handleHideUpdateFormClick = (e) => {
    e.preventDefault();
    this.setState({
      "display_update_form": false,
      "id_produit_update": 0,
      "nom_produit_update": "",
      "qty_produit_update": 0,
      "prix_produit_update": 0
    });
  };

  //handleFormInput générique :)
  handleFormInputChange(event) {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { data, message } = this.state;
    //console.log(data);
    return (
      <div className="App">
        <h1>CRUD Produits</h1>
        <h2>{message}</h2>

        <h2>Ajout de produit</h2>
        <form align="center">
          Nom Produit : <input onChange={this.handleFormInputChange} type="text" name="nom_produit_add" value={this.state.nom_produit_add} />
          <br />
          Image Produit : <input id="image_produit_add" onChange={this.handleFormInputChange} type="file" name="image_produit_add" />
          <br />
          Quantité : <input onChange={this.handleFormInputChange} type="number" name="qty_produit_add" value={this.state.qty_produit_add} />
          <br />
          Prix : <input onChange={this.handleFormInputChange} type="number" name="prix_produit_add" value={this.state.prix_produit_add} />
          <br />
          <button onClick={this.handleAddClick}>Ajouter</button>
        </form>
        {this.state.display_update_form ? 
        <div>
          <h2>Modifier le produit d'id = {this.state.id_produit_update}</h2>
          <a href="#" onClick={this.handleHideUpdateFormClick.bind(this)}>Fermer le formulaire de mise à jour</a>
          <br />
          <br />
          <form align="center">
            Nom Produit : <input onChange={this.handleFormInputChange} type="text" name="nom_produit_update" value={this.state.nom_produit_update} />
            <br />
            Image Produit : <input id="image_produit_update" onChange={this.handleFormInputChange} type="file" name="image_produit_update" />
            <br />
            Quantité : <input onChange={this.handleFormInputChange} type="number" name="qty_produit_update" value={this.state.qty_produit_update} />
            <br />
            Prix : <input onChange={this.handleFormInputChange} type="number" name="prix_produit_update" value={this.state.prix_produit_update} />
            <br />
            <button onClick={this.handleUpdateClick.bind(this, this.state.id_produit_update)}>Mettre à jour</button>
          </form>
        </div>
         : ""}
        <h2>Liste des produits</h2>
        <center>
          <table border="1">
            <thead>
              <tr>
                <td>ID Produit</td>
                <td>Nom Produit</td>
                <td>Image Produit</td>
                <td>Quantité</td>
                <td>Prix Unitaire (€)</td>
                <td>Prix Total (€)</td>
                <td>Modifier Produit</td>
                <td>Supprimer Produit</td>
              </tr>
            </thead>
            <tbody>
              {data.map((produit, i) =>
                <tr align="center" key={produit.id}>
                  <td>{produit.id}</td>
                  <td>{produit.nom}</td>
                  <td><img width="50px" height="50px" src={STATIC_URL + '/uploads/produits/' + produit.image} /></td>
                  <td>{produit.qty}</td>
                  <td>{produit.prix}</td>
                  <td>{produit.qty * produit.prix}</td>
                  <td><a href="#" onClick={this.handleDisplayFormUpdateClick.bind(this, produit.id)}>Modifier Produit</a></td>
                  <td><a href="#" onClick={this.handleDeleteClick.bind(this, produit.id)}>Supprimer</a></td>
                </tr>)
              }
            </tbody>
          </table>
        </center>
      </div>
    );


  }
}

export default ProduitsList;
