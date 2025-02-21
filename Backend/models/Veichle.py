from utils.database import db

class Veichle (db.Model): 
    
    __tablename__ = "vehicles"
    
    VIN_number = db.Column(db.String(100), primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    make = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    made_year = db.Column(db.Integer, nullable=False)
    engine = db.Column(db.Float, nullable=False)
    engine_power = db.Column(db.Integer, nullable=False)
    license_plate = db.Column(db.String(10), nullable=False)
    
    def __init__(self, client_id, make, model, made_year, engine, engine_power, license_plate, VIN_number):
        self.client_id = client_id
        self.make = make
        self.model = model
        self.made_year = made_year
        self.engine = engine
        self.engine_power = engine_power
        self.license_plate = license_plate
        self.VIN_number = VIN_number