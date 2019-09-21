from .db_utils import getDB
from .models import Client
import hashlib

#Plein de code sur SQLAlchemy
#http://www.mapfish.org/doc/tutorials/sqlalchemy.html

class ClientDao:

    def __init__(self):
        self.mydb = getDB()    
        self.session = self.mydb.session

    def getClientByCredentials(self, login, password):
        #query = 'SELECT login FROM client WHERE login = %s AND password = SHA1(%s)'
        client = None
        client = self.session.query(Client).filter_by(login=login, password=hashlib.sha1(password.encode('utf-8')).hexdigest()).first()
        return client

    def getClientByLogin(self, login):
        client = None
        try:
            client = self.session.query(Client).filter_by(login=login).first()                
        except:
            return None
        return client

    def getListClients(self):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        #query = 'SELECT * FROM client'
        #[Client(...), Client(...), Client(...)]
        try:
            listClients = self.session.query(Client).all()
            #print("Liste des résultats : ", listClients)
            return listClients
        except:
            return []
        

    def getClient(self, id):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        #query = 'SELECT * FROM client WHERE id = {0}'.format(id)
        #[Client(...), Client(...), Client(...)]
        try:
            client = self.session.query(Client).filter_by(id=id).first()        
            return client
        except:
            return None
        
    def createClient(self, client):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        try:
            client_model = Client(**client)
            self.session.add(client_model)
            self.session.commit()
            return True
        except:
            return False

    def updateClient(self, client):
        #query = 'UPDATE client SET nom = %s, image = %s, qty = %s, prix = %s WHERE id = %s'        
        #https://code-maven.com/slides/python-programming/orm-update        
        try:
            self.session.query(Client).filter_by(id=client['id']).update(client)        
            self.session.commit() 
            return True
        except:
            return False

    def deleteClient(self, id):
        #query = 'DELETE FROM client WHERE id = {0}'.format(id)
        try:
            self.session.query(Client).filter_by(id=id).delete()        
            self.session.commit()
            return True
        except:
            return False
