from ..dao import ProduitDao

class ProduitService:

    def __init__(self):
        self.dao = ProduitDao()

    def getListProduits(self):
        return self.dao.getListProduits()

    def getProduit(self, id):
        return self.dao.getProduit(id)

    def createProduit(self, produit):
        return self.dao.createProduit(produit)

    def updateProduit(self, produit):
        return self.dao.updateProduit(produit)

    def deleteProduit(self, id):
        return self.dao.deleteProduit(id)
