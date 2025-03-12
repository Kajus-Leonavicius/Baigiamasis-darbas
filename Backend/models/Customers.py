from utils.database import db

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_name = db.Column(db.String(255), db.ForeignKey("users.company_name"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    surname = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), unique=True, nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=True)

    vehicles = db.relationship("Vehicle", backref="owner", lazy=True, cascade="all, delete-orphan")

    def __init__(self, name, surname, phone, email, company_name):
        self.name = name
        self.surname = surname
        self.phone = phone
        self.email = email
        self.company_name = company_name
    
    @staticmethod
    def get_customers(company_name):
        return Customer.query.filter_by(company_name=company_name).all()