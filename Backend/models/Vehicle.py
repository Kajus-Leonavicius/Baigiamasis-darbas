from utils.database import db

class Vehicle(db.Model):
    __tablename__ = "vehicle"
    
    VIN = db.Column(db.String(17), unique=True, primary_key=True, nullable=False)
    make = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    engine = db.Column(db.Float, nullable=False)
    Kw = db.Column(db.Integer, nullable=False)
    license_plate = db.Column(db.String(6), nullable = False)

    def __init__(self, VIN, make, model, year, engine, Kw, license_plate):
        self.VIN = VIN
        self.make = make
        self.model = model
        self.year = year
        self.engine = engine
        self.Kw = Kw
        self.license_plate = license_plate

    def get_by_id(VIN):
        return Vehicle.query.filter_by(VIN).first()

    @staticmethod
    def get_all(filters={}):
        if "VIN" in filters:
            query = Vehicle.query.filter_by(id=filters["VIN"])
        return query.all()

    @staticmethod
    def create(data):
        new_vehicle = Vehicle(**data)
        db.session.add(new_vehicle)
        db.session.commit()
        return new_vehicle

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()