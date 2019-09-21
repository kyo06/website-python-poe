from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

mydb = create_engine("mysql://root:root@localhost:3306/website")
Session = sessionmaker(bind=mydb)
mydb.session = Session()

def getDB():
  return mydb

#Créer toutes les tables en mode Code First
#Base.metadata.create_all(mydb)
#print(mydb)