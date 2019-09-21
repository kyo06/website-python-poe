import React, { Component } from 'react';
import jwt_decode from 'jwt-decode'; //"@types/jwt-decode": "^2.2.1", "jwt-decode": "^2.2.0",
import ProduitsList from './produits/ProduitsList'


const SERVER_URL = 'http://localhost:5000'
const API_URL = SERVER_URL + '/api'
const STATIC_URL = SERVER_URL + '/static'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      message: '',
      display_login_form: true,
      display_produits_crud: false
    };
    //avec un seul hangleFormChange : OK
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  //handleFormInput générique :)
  handleFormInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleLoginClick = (e) => {
    e.preventDefault();
    this.login();
  };

  handleLogoutClick = (e) => {
    e.preventDefault();
    this.logout();
  };

  logout = () => {
    let token = window.sessionStorage["token"]
    window.sessionStorage.clear();

    let thatComponent = this;

    //Blacklister le token JWT
    fetch(API_URL + '/logout', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(response.status)
      }
      thatComponent.setState({
        login: '',
        password: '',
        message: 'Vous avez été déconnecté',
        display_login_form: true,
        display_produits_crud: false
      })

      //return response.json();
    }).catch(function (error) {
      ///if status code 401...
      thatComponent.setState({
        login: '',
        password: '',
        message: 'Vous avez été déconnecté car la session est expirée',
        display_login_form: true,
        display_produits_crud: false
      })

    });
  }

  login = () => {
    let login = this.state.login;
    let password = this.state.password;

    let thatComponent = this;

    fetch(API_URL + '/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'login': login,
          'password': password
        })
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(response.status)
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let payload = jwt_decode(data.token);
        console.log(payload);

        window.sessionStorage["connected"] = true;
        window.sessionStorage["token"] = data.token
        window.sessionStorage["payload"] = JSON.stringify(payload);

        thatComponent.setState({ message: 'Authorisé' }, function () {
          //Afficher le composant ProduitsList
          //<ProduitsList />
          thatComponent.setState({ display_login_form: false, display_produits_crud: true, message: '' });
        });

      }).catch((error) => {
        ///if status code 401...
        thatComponent.setState({ message: 'Pas authorisé' });
      });
  }

  componentDidMount() {
  }

  render() {
    const message = this.state.message;
    return (
      <div>
        <div>{message}</div>
        <br />
        {this.state.display_login_form ? 
        <div>
          Page de Login
          <form>
            Login : <input onChange={this.handleFormInputChange} id="login" type="text" name="login" value={this.state.login} /><br />
            Password : <input onChange={this.handleFormInputChange} id="password" type="password" name="password" value={this.state.password} /><br />
            <input onClick={this.handleLoginClick} type="button" value="Se connecter" />
          </form>
        </div>
        : ""}
        {this.state.display_produits_crud ?
              <div>
                <h1>Bienvenue {this.state.login}</h1>
                <button onClick={this.handleLogoutClick}>Logout</button>
                <ProduitsList handleLogout={this.logout} />
              </div> : ""}
      </div>);
  }
}

export default Login;