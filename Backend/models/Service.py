from utils.database import db

class Service(db.Model):
    __tablename__ = "service"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(100), nullable = False, default = "Galima atlikti")
    company_name = db.Column(db.String(255), nullable=False)
    
    

    def __init__(self, service_name, description, status, company_name ,duration=None):
        self.service_name = service_name
        self.description = description
        self.duration = duration
        self.status = status
        self.company_name = company_name

    def get_all(company_name):
        return Service.query.filter_by(company_name = company_name).all()

    @staticmethod
    def create_new_service(data):
        new_service = Service(**data)
        db.session.add(new_service)
        db.session.commit()
        return new_service

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    @staticmethod
    def delete_service(service_id):
        service = Service.query.get(service_id)
        if not service:
            return {"message": "service not found"}, 404 

        db.session.delete(service)
        db.session.commit()
        return {"message": "service deleted successfully"}