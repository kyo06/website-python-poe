from .db_utils import getDB
from .models import Produit
from sqlalchemy.orm import sessionmaker

#Plein de code sur SQLAlchemy
#http://www.mapfish.org/doc/tutorials/sqlalchemy.html

class ProduitDao:

    def __init__(self):
        self.mydb = getDB()    
        Session = sessionmaker(bind=self.mydb)
        self.session = Session()

    def getListProduits(self):
        #query = 'SELECT * FROM produit'
        #[Produit(...), Produit(...), Produit(...)]
        listProduits = self.session.query(Produit).all()
        print("Liste des résultats : ", listProduits)
        return listProduits


    def getProduit(self, id):
        #query = 'SELECT * FROM produit WHERE id = {0}'.format(id)
        #[Produit(...), Produit(...), Produit(...)]
        produit = self.session.query(Produit).filter(Produit.id == id).first()        
        return produit

    def createProduit(self, produit):
        #query = 'INSERT INTO produit (`nom`, `image`, `qty`, `prix`) VALUES (%s, %s, %s, %s)'
        produit_model = Produit(**produit)
        result = self.session.add(produit_model)
        self.session.commit()
        #rows_added = result.rowcount
        #print(rows_added, "record(s) added")
        return 1 #rows_added > 0

    def updateProduit(self, produit):
        #query = 'UPDATE produit SET nom = %s, image = %s, qty = %s, prix = %s WHERE id = %s'        
        produit_model = Produit(**produit)
        result = self.session.update(produit_model)
        self.session.commit()
        #rows_updated = result.rowcount
        #print(rows_updated, "record(s) updated")
        return 1 #rows_updated > 0

    def deleteProduit(self, id):
        #query = 'DELETE FROM produit WHERE id = {0}'.format(id)
        produit_model = self.getProduit(id) #obligation de récupérer un objet managé par l'ORM
        self.session.delete(produit_model)
        self.session.commit()
        #rows_deleted = self.session.rowcount
        #print(rows_deleted, "record(s) deleted")
        return 1 #rows_deleted > 0
