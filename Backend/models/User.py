from utils.database import db
from models.associations import user_service, user_vehicle

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    surname = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), unique=True, nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=True)
    company_name = db.Column(db.String(255), unique=True, nullable=True)
    
    services = db.relationship("Service", secondary=user_service, backref="employees")
    employees = db.relationship("Employee", backref="company", lazy=True)
    customers = db.relationship("Customer", backref ='company', lazy=True)
    

    # galimai nereikalingas vehicles = db.relationship("Vehicle", secondary=user_vehicle, backref="owners")

    def __init__(self, name, surname, phone, email, password=None, company_name=None):
        self.name = name
        self.surname = surname
        self.phone = phone
        self.email = email
        self.password = password
        self.company_name = company_name
        
    @staticmethod
    def get_single_user(email):
        return User.query.filter_by(email=email).first()
        
    @staticmethod
    def get_all(filters={}):
        query = User.query

        if "role" in filters:
            query = query.filter_by(role=filters["role"]) 

        if "user_id" in filters:
            query = query.filter_by(id=filters["user_id"])

        if "email" in filters:
            query = query.filter_by(email=filters["email"])
        return query.all()
    
    @staticmethod
    def create_user(data):
        new_user = User(**data)
        db.session.add(new_user)
        db.session.commit()
        return new_user
    
    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()