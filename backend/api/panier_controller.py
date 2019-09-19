from flask import session, redirect, request, render_template
from . import routesAPIREST
import os
from werkzeug import secure_filename


# Create a directory in a known location to save files to.
uploads_dir = os.path.join(os.path.dirname(__file__), '../static/uploads')
os.makedirs(uploads_dir, exist_ok=True)

@routesAPIREST.route('/ajout_produit', methods=['GET']) 
def ajout_produit_controlleur(): 
    if 'connected' in session and session['connected'] == True:
        return routesAPIREST.send_static_file("formulaire_ajout_produit.html")
    else:
        return redirect("/") #code=302

 #session['panier'] = {
        #    'savon de marseille' : { 'qty': 5, 'prix': 5, 'prix_total': 25},
        #    'gel douche' : { 'qty': 3, 'prix': 10, 'prix_total': 30},
        #    'chocolat' : { 'qty': 2, 'prix': 15, 'prix_total': 30},
        #    'anti cafard' : { 'qty': 1, 'prix': 7, 'prix_total': 7}              
        #}
@routesAPIREST.route('/ajout_produit', methods=['POST']) 
def ajout_post_produit_controlleur(): 
    if 'connected' in session and session['connected'] == True:
        nom_produit = request.form.get('nom_produit')
        nom_produit = nom_produit.lower()
        qty_produit = int(request.form.get('qty_produit'))
        prix_unitaire = float(request.form.get('prix_unitaire'))
        if nom_produit not in session['panier']:
            session['panier'][nom_produit] = {}
        session['panier'][nom_produit]['qty'] = qty_produit
        session['panier'][nom_produit]['prix'] = prix_unitaire
        session['panier'][nom_produit]['prix_total'] = prix_unitaire * qty_produit

        #récupération de l'objet contenant les informations
        #du fichier uploadé
        image = request.files['image_produit']
        
        # Create a directory in a known location to save files to.
        user_directory = session['login'] + '/'
        uploads_dir_user = os.path.join(os.path.dirname(__file__), '../static/uploads/' + user_directory)
        os.makedirs(uploads_dir_user, exist_ok=True)

        #Enregistrer le fichier dans le dossier upload de l'utilisateur
        filename_final = secure_filename(image.filename)
        destination_filename = os.path.join(uploads_dir_user, filename_final)
        image.save(destination_filename)

        #on ajouter le dossier utilisateur au filename 
        #et on le référencie dans la session
        session['panier'][nom_produit]['image'] = user_directory + filename_final
        print("Filename upload : ", filename_final)

        return redirect("/membre") #code=302
    else:
        return redirect("/") #code=302

#http://localhost:5000/supprimer_produit?name=savon
@routesAPIREST.route('/supprimer_produit', methods=['GET']) 
def supprimer_produit_controlleur():
    if 'connected' in session and session['connected'] == True:
        nom_produit = request.args.get('name')
        if nom_produit in session['panier']:
            session['panier'].pop(nom_produit)
        return redirect("/membre") #code=302
    else:
        return redirect("/") #code=302
        
#/modifier_produit?nom_produit=savon
@routesAPIREST.route('/modifier_produit', methods=['GET']) 
def modifier_produit_controlleur(): 
    if 'connected' in session and session['connected'] == True:
        nom_produit = request.args.get('name')
        nom_produit = nom_produit.lower()
        if nom_produit not in session['panier']:
            return redirect("/") #code=302
        return render_template('formulaire_modifier_produit.html',
                                nom_produit = nom_produit,
                                qty = session['panier'][nom_produit]['qty'],
                                image_produit = session['panier'][nom_produit]['image'],
                                prix_unitaire = session['panier'][nom_produit]['prix']
                                )

    else:
        return redirect("/") #code=302

@routesAPIREST.route('/modifier_produit', methods=['POST']) 
def modifier_post_produit_controlleur(): 
    if 'connected' in session and session['connected'] == True:
        nom_produit = request.form.get('nom_produit')
        nom_produit = nom_produit.lower()
        qty_produit = int(request.form.get('qty_produit'))
        prix_unitaire = float(request.form.get('prix_unitaire'))
        if nom_produit not in session['panier']:
            session['panier'][nom_produit] = {}
        session['panier'][nom_produit]['qty'] = qty_produit
        session['panier'][nom_produit]['prix'] = prix_unitaire
        session['panier'][nom_produit]['prix_total'] = prix_unitaire * qty_produit

        #récupération de l'objet contenant les informations
        #du fichier uploadé
        image = request.files['image_produit']
        
        # Create a directory in a known location to save files to.
        user_directory = session['login'] + '/'
        uploads_dir_user = os.path.join(os.path.dirname(__file__), '../static/uploads/' + user_directory)
        os.makedirs(uploads_dir_user, exist_ok=True)

        #Enregistrer le fichier dans le dossier upload de l'utilisateur
        filename_final = secure_filename(image.filename)
        destination_filename = os.path.join(uploads_dir_user, filename_final)
        image.save(destination_filename)

        #on ajouter le dossier utilisateur au filename 
        #et on le référencie dans la session
        session['panier'][nom_produit]['image'] = user_directory + filename_final
        print("Filename upload : ", filename_final)

        return redirect("/membre") #code=302
    else:
        return redirect("/") #code=302
