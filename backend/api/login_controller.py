from flask import jsonify
from . import routesAPIREST
from flask import redirect, request

from .services import AuthService, JWT_TOKEN_BLACK_LIST, JWT_SECRET, JWT_ALGORITHM, JWT_EXP_DELTA_SECONDS

import jwt


@routesAPIREST.route('/login', methods=['POST']) 
def login_access_controlleur():
    #body est la représentation du JSON en objet python
    #{...} -> dictonnaire Python
    #[...] -> liste Python

    #{"login": "", "password": ""}
    body = request.json
    login = body['login']
    password = body['password']
    
    authService = AuthService()    
    jwt_token = authService.generateJWT(login, password)
        
    if jwt_token is not None:
        return jsonify({'token': jwt_token.decode('utf-8')})
    else:
        return jsonify({'message': 'Identifiant et/ou mdp incorrect'}), 401

@routesAPIREST.route('/logout', methods=['GET']) 
def logout_controlleur(): 
    jwt_token = request.headers.get('Authorization')   
    JWT_TOKEN_BLACK_LIST.add(jwt_token)
    try:
        payload = jwt.decode(jwt_token, JWT_SECRET, JWT_ALGORITHM)
        return jsonify({'message': 'Utilisateur {0} déconnecté'.format(payload['nom'])})
    except (KeyError, jwt.DecodeError, jwt.ExpiredSignature):
        pass   
    return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'})
    