import React, { Component } from 'react';

/*
[
  {
    "name": "savon de marseille", 
    "prix": 5, 
    "prix_total": 25, 
    "qty": 5
  }, 
  {
    "name": "gel douche", 
    "prix": 10, 
    "prix_total": 30, 
    "qty": 3
  }, 
  {
    "name": "chocolat", 
    "prix": 15, 
    "prix_total": 30, 
    "qty": 2
  }, 
  {
    "name": "anti cafard", 
    "prix": 7, 
    "prix_total": 7, 
    "qty": 1
  }
]
*/

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
      "image_produit_add": "",
      "qty_produit_add": 0,
      "prix_produit_add": 0,

      "display_update_form": false,
      "id_produit_update": 0,
      "nom_produit_update": "",
      "image_produit_update": "",
      "qty_produit_update": 0,
      "prix_produit_update": 0
    };
    //avec un seul hangleFormChange : OK
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
  }

  componentDidMount() {
    this.getListProduits();
  }

  getListProduits() {
    return fetch(API_URL + '/produits', { method: 'GET' })
    .then(response => response.json())
    .then(data => this.setState({"data": data}))
  }

  supprimerProduit(id) {
    return fetch(API_URL + '/produits/' + id, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => { 
      this.setState({"message": data.message}); 
      this.getListProduits(); 
    })
  }

  modifierProduit(id) {
    return fetch(API_URL + '/produits/' + id,
    { 
      method: 'PUT', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {'nom': this.state.nom_produit_update, 'image': this.state.image_produit_update,
        'qty': this.state.qty_produit_update, 'prix': this.state.prix_produit_update})
    }).then(response => response.json())
    .then(data => { 
      this.setState({"message": data.message}); 
      this.getListProduits().then(() => {
        this.setState({
          "display_update_form": false,
          "id_produit_update": 0,
          "nom_produit_update": "",
          "image_produit_update": "",
          "qty_produit_update": 0,
          "prix_produit_update": 0
        });
      }); 
    })
  }

  ajouterProduit() {
    return fetch(API_URL + '/produits', 
    { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {'nom': this.state.nom_produit_add, 'image': this.state.image_produit_add,
        'qty': this.state.qty_produit_add, 'prix': this.state.prix_produit_add})
    }).then(response => response.json())
    .then(data => { 
      this.setState({"message": data.message}); 
      return this.getListProduits(); 
    })
  }

  handleDeleteClick = (id, e) => {
    e.preventDefault();
    console.log('The link was clicked.');
    this.supprimerProduit(id);
    
    //Cacher le formulaire d'update si on a supprimé le produit sélectionné
    if(id == this.state.id_produit_update) {
      this.setState({
        "display_update_form": false,
        "id_produit_update": 0,
        "nom_produit_update": "",
        "image_produit_update": "",
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
    for(let index_produit in this.state.data) {
      let produit = this.state.data[index_produit];
      console.log(produit)
      if(produit['id'] == id) {
        this.setState({
          display_update_form: true,
          id_produit_update : id,
          nom_produit_update : produit['nom'],
          image_produit_update : produit['image'],
          qty_produit_update : produit['qty'],
          prix_produit_update : produit['prix']
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
      "image_produit_update": "",
      "qty_produit_update": 0,
      "prix_produit_update": 0
    });
  };

  //handleFormInput générique :)
  handleFormInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const {data, message} = this.state;
    return (
      <div className="App">
        <h1>CRUD Produits</h1>
        <h2>{message}</h2>

        <h2>Ajout de produit</h2>
        <form align="center">
          Nom Produit : <input onChange={this.handleFormInputChange} type="text" name="nom_produit_add" value={this.state.nom_produit_add}  />          
          <br />
          Image Produit : <input onChange={this.handleFormInputChange} type="text" name="image_produit_add" value={this.state.image_produit_add} />
          <br />
          Quantité : <input onChange={this.handleFormInputChange} type="number" name="qty_produit_add" value={this.state.qty_produit_add} />
          <br />
          Prix : <input onChange={this.handleFormInputChange} type="number" name="prix_produit_add" value={this.state.prix_produit_add} />
          <br />
          <button onClick={this.handleAddClick}>Ajouter</button>         
        </form>

        <div style={this.state.display_update_form ? {} : { display: 'none' }}>
        <h2>Modifier le produit d'id = {this.state.id_produit_update}</h2>
        <a href="#" onClick={this.handleHideUpdateFormClick.bind(this)}>Fermer le formulaire de mise à jour</a>
        <br />
        <br />
        <form align="center">
          Nom Produit : <input onChange={this.handleFormInputChange} type="text" name="nom_produit_update" value={this.state.nom_produit_update}  />          
          <br />
          Image Produit : <input onChange={this.handleFormInputChange} type="text" name="image_produit_update" value={this.state.image_produit_update} />
          <br />
          Quantité : <input onChange={this.handleFormInputChange} type="number" name="qty_produit_update" value={this.state.qty_produit_update} />
          <br />
          Prix : <input onChange={this.handleFormInputChange} type="number" name="prix_produit_update" value={this.state.prix_produit_update} />
          <br />
          <button onClick={this.handleUpdateClick.bind(this, this.state.id_produit_update)}>Mettre à jour</button>
        </form>  
        </div>
        <h2>Liste des produits</h2>
        <center>
        <table border="1">
            <thead>
            <tr>
                <td>ID Produit</td>
                <td>Nom Produit</td>
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
                  <td>{ produit.id }</td>
                  <td>{ produit.nom }</td>
                  <td>{ produit.qty }</td>
                  <td>{ produit.prix }</td>
                  <td>{ produit.qty * produit.prix }</td>
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
