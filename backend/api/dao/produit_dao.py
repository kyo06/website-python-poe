from .db_utils import getDB
from .models import Produit

class ProduitDao:

    def __init__(self):
        self.mydb = getDB()    

    def getListProduits(self):
        query = 'SELECT * FROM produit'
        mycursor = self.mydb.cursor(dictionary=True)
        mycursor.execute(query)
        myresults = mycursor.fetchall()
        
        mycursor.close()

        listProduits = []
        print("Liste des résultats : ", myresults)

        for p in myresults:
            print("Produit : ", p)

            #Creation d'une instance de la classe Produit
            produit = Produit()
            produit.id = p['id']
            produit.nom = p['nom']
            produit.image = p['image']
            produit.qty = p['qty']
            produit.prix = p['prix']
            listProduits.append(produit)

        return listProduits


    def getProduit(self, id):
        query = 'SELECT * FROM produit WHERE id = {0}'.format(id)
        mycursor = self.mydb.cursor(dictionary=True)
        mycursor.execute(query)
        myresult = mycursor.fetchone()
        mycursor.close()

        print("Produit : ", myresult)

        if myresult is None:
            return None

        #Creation d'une instance de la classe Produit
        produit = Produit()
        produit.id = myresult['id']
        produit.nom = myresult['nom']
        produit.image = myresult['image']
        produit.qty = myresult['qty']
        produit.prix = myresult['prix']

        return produit

    def createProduit(self, produit):
        query = 'INSERT INTO produit (`nom`, `image`, `qty`, `prix`) VALUES (%s, %s, %s, %s)'
        mycursor = self.mydb.cursor()
        vals = (produit['nom'], produit['image'], produit['qty'], produit['prix'])
        mycursor.execute(query, vals)
        
        self.mydb.commit()
        rows_added = mycursor.rowcount
        mycursor.close()

        print(rows_added, "record(s) added")

        return rows_added > 0

    def updateProduit(self, produit):
        query = 'UPDATE produit SET nom = %s, image = %s, qty = %s, prix = %s WHERE id = %s'
        mycursor = self.mydb.cursor()
        vals = (produit['nom'], produit['image'], produit['qty'], produit['prix'], produit['id'])
        mycursor.execute(query, vals)
        
        self.mydb.commit()
        rows_updated = mycursor.rowcount
        mycursor.close()

        print(rows_updated, "record(s) updated")

        return rows_updated > 0

    def deleteProduit(self, id):
        query = 'DELETE FROM produit WHERE id = {0}'.format(id)
        mycursor = self.mydb.cursor()
        mycursor.execute(query)

        self.mydb.commit()
        rows_deleted = mycursor.rowcount
        mycursor.close()

        print(rows_deleted, "record(s) deleted")

        return rows_deleted > 0