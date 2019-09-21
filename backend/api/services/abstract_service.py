
class AbstractService:

    def __init__(self, dao_class):
        self.dao = dao_class()
        
    def findAll(self):
        return self.dao.findAll()

    def findOneById(self, id):
        return self.dao.findOneById(id)

    def create(self, produit):
        return self.dao.create(**produit)

    def update(self, produit):
        return self.dao.update(**produit)

    def delete(self, id):
        return self.dao.deleteById(id)