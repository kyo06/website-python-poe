from .db_utils import getDB
from .models import Produit

#Plein de code sur SQLAlchemy
#http://www.mapfish.org/doc/tutorials/sqlalchemy.html

class ProduitDao:

    def __init__(self):
        self.mydb = getDB()    
        self.session = self.mydb.session

    def getListProduits(self):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        #query = 'SELECT * FROM produit'
        #[Produit(...), Produit(...), Produit(...)]
        try:
            listProduits = self.session.query(Produit).all()
            #print("Liste des résultats : ", listProduits)
            return listProduits
        except:
            return []
        

    def getProduit(self, id):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        #query = 'SELECT * FROM produit WHERE id = {0}'.format(id)
        #[Produit(...), Produit(...), Produit(...)]
        try:
            produit = self.session.query(Produit).filter_by(id=id).first()        
            return produit
        except:
            return None
        
    def createProduit(self, produit):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        #query = 'INSERT INTO produit (`nom`, `image`, `qty`, `prix`) VALUES (%s, %s, %s, %s)'
        try:
            produit_model = Produit(**produit)
            self.session.add(produit_model)
            self.session.commit()
            return True
        except:
            return False

    def updateProduit(self, produit):
        #query = 'UPDATE produit SET nom = %s, image = %s, qty = %s, prix = %s WHERE id = %s'        
        #https://code-maven.com/slides/python-programming/orm-update        
        try:
            self.session.query(Produit).filter_by(id=produit['id']).update(produit)        
            self.session.commit() 
            return True
        except:
            return False

    def deleteProduit(self, id):
        #query = 'DELETE FROM produit WHERE id = {0}'.format(id)
        try:
            self.session.query(Produit).filter_by(id=id).delete()        
            self.session.commit()
            return True
        except:
            return False
