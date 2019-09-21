from ..dao import ProduitDao

class ProduitService:

    def __init__(self):
        self.dao = ProduitDao()

    def getListProduits(self):
        return self.dao.findAll()

    def getProduit(self, id):
        return self.dao.findOneById(id)

    def createProduit(self, produit):
        return self.dao.create(**produit)

    def updateProduit(self, produit):
        return self.dao.update(**produit)

    def deleteProduit(self, id):
        return self.dao.deleteById(id)
