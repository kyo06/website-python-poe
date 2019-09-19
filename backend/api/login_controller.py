from flask import jsonify
from . import routesAPIREST
from flask import session, redirect, request




@routesAPIREST.route('/login', methods=['POST']) 
def login_access_controlleur():
    login = request.form.get('login')
    mdp = request.form.get('mdp')
    if login == "admin" and mdp == "pass":
        session['connected'] = True
        session['login'] = login       
        session['panier'] = {} 
        return redirect("/membre") #code=302
    else:
        return "Vous n'êtes pas autorisé à vous connecter"


@routesAPIREST.route('/logout', methods=['GET']) 
def logout_controlleur(): 
    session.clear()
    return redirect("/formulaire_login") #code=302