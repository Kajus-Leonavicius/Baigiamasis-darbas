from utils.database import db
from datetime import date



class User(db.Model):
    __tablename__ = "users" 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    surname = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(100), default="Customer", nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.Date, default=db.func.current_date())
    
    vehicles = db.relationship('Veichle', backref="user", lazy=True)

    def __init__(self, email, password, name, surname=None, role="Customer", created_at=None):
        self.email = email
        self.password = password
        self.name = name
        self.surname = surname if surname else ""
        self.role = role
        self.created_at = created_at if created_at else date.today()
