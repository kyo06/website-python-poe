from flask import jsonify
from . import routesAPIREST
from flask import session, redirect, request

from .services import ProduitService
    
#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits', methods=['GET']) 
def list_produits_controlleur(): 
    #Fonctionnel
    produitService = ProduitService()
    listProduits = produitService.getListProduits()
    #listProduits = [
    #        {'name': 'savon de marseille', 'qty': 5, 'prix': 5, 'prix_total': 25},
    #        {'name': 'gel douche', 'qty': 3, 'prix': 10, 'prix_total': 30},
    #        {'name': 'chocolat', 'qty': 2, 'prix': 15, 'prix_total': 30},
    #        {'name': 'anti cafard', 'qty': 1, 'prix': 7, 'prix_total': 7}              
    #    ]

    listProduitsJSON = []

    for produit in listProduits:
        p = {}
        p['id'] = produit.id
        p['nom'] = produit.nom
        p['image'] = produit.image
        p['qty'] = produit.qty
        p['prix'] = produit.prix
        listProduitsJSON.append(p)

    return jsonify(listProduitsJSON)

#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits/<int:id>', methods=['GET']) 
def get_produit_controlleur(id): 
    #Fonctionnel
    produitService = ProduitService()
    produit = produitService.getProduit(id)

    if produit is None:
        return jsonify({ "message": "Le produit n'existe pas." })

    p = {}
    p['id'] = produit.id
    p['nom'] = produit.nom
    p['image'] = produit.image
    p['qty'] = produit.qty
    p['prix'] = produit.prix

    return jsonify(p)

#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits', methods=['POST']) 
def create_produit_controlleur(): 
    #Ajouter le produit dans la base de données
    #Fonctionnel
    produitService = ProduitService()
    produit = request.json 
    isOk = produitService.createProduit(produit)

    if not isOk:
        return jsonify({ "message": "Problème de création du produit." })

    return jsonify({ "message": "Le produit a bien été créé." })


#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits/<int:id>', methods=['PUT']) 
def update_produit_controlleur(id): 
    #Mettre à jour le produit dans la base de données
    #Fonctionnel
    produitService = ProduitService()
    produit = request.json
    produit['id'] = id
    isOk = produitService.updateProduit(produit)

    if not isOk:
        return jsonify({ "message": "Le produit n'existe pas ou n'a pas besoin d'être à jour." })

    return jsonify({ "message": "Le produit a bien été mis à jour." })


#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits/<int:id>', methods=['DELETE']) 
def delete_produit_controlleur(id): 
    #Fonctionnel
    produitService = ProduitService()
    isOk = produitService.deleteProduit(id)

    if not isOk:
        return jsonify({ "message": "Le produit n'existe pas." })

    return jsonify({ "message": "Le produit a bien été supprimé." })
