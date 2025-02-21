from utils.database import db

class Services (db.Model): 
    
    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(100), nullable=False)
    
    def __init__(self, service):
        self.service = service