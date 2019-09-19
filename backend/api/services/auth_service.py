from ..dao import ClientDao
import jwt
from datetime import datetime
import time

JWT_SECRET = 'mysecret'
JWT_ALGORITHM = 'HS256'
#Durée de validité du TOKEN (session)
#avec JWT, plus de notion de session gérée par un serveur
JWT_EXP_DELTA_SECONDS = 600 #10 minutes (durée session)
JWT_TOKEN_BLACK_LIST = set()

class AuthService:

    def __init__(self):
        self.dao = ClientDao()

    def checkCredentials(self, login, password):
        return self.dao.checkCredentials(login, password)
    
    def isExistLogin(self, login):
        return self.dao.isExistLogin(login)
    
    def getValidJWTPayload(self, request):
        payload = None

        jwt_token = request.headers.get('Authorization')   
        if jwt_token in JWT_TOKEN_BLACK_LIST:
            return payload

        try:
            payload = jwt.decode(jwt_token, JWT_SECRET, JWT_ALGORITHM)
            if payload['exp'] < int(time.time()):
                return None
        except (KeyError, jwt.DecodeError, jwt.ExpiredSignature):
            return payload

        return payload