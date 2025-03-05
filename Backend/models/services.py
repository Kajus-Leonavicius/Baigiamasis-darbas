from utils.database import db

class Service(db.Model):
    __tablename__ = "service"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(100), nullable = False, default = "Galima atlikti")
    required_specialization = db.Column(db.String(100), nullable=False)
    
    

    def __init__(self, service_name, description, required_specialization, status, duration=None):
        self.service_name = service_name
        self.description = description
        self.duration = duration
        self.required_specialization = required_specialization
        self.status = status

    def get_all(filters={}):
        """        if "service_id" in filters:
            query = Service.query.filter_by(id=filters["service_id"])"""
        return Service.query.all()

    @staticmethod
    def create(data):
        new_service = Service(**data)
        db.session.add(new_service)
        db.session.commit()
        return new_service

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()