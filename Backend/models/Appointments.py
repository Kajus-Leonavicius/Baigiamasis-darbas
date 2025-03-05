from utils.database import db
from models.User import User
from models.Vehicle import Vehicle
from datetime import datetime ,timedelta
from models.associations import appointment_services

class Appointment(db.Model):
    __tablename__ = "appointments"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    vehicle_VIN = db.Column(db.String(17), db.ForeignKey("vehicle.VIN"), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum("scheduled", "completed", "cancelled"), nullable=False, default="scheduled")
    employee_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    # **Relationships**
    client = db.relationship("User", foreign_keys=[client_id], backref="client_appointments")
    vehicle = db.relationship("Vehicle", backref="appointments")
    employee = db.relationship("User", foreign_keys=[employee_id], backref="employee_appointments")
    
    # **✅ Many-to-Many Relationship**
    services = db.relationship("Service", secondary=appointment_services, backref="appointments")


    def __init__(self, client_id, vehicle_VIN, datetime, status="scheduled", employee_id=None,  service_id=None):
        self.client_id = client_id
        self.vehicle_VIN = vehicle_VIN
        self.service_id = service_id
        self.datetime = datetime
        self.status = status
        self.employee_id = employee_id
        
    @property
    def end_datetime(self):
        if self.services:
            total_duration = sum(service.duration for service in self.services)
            return self.datetime + timedelta(minutes=total_duration)
        return self.datetime

    
    @staticmethod
    def get_all():
        
        return  Appointment.query.all()

    @staticmethod
    def create(data):
        new_appointment = Appointment(**data)
        db.session.add(new_appointment)
        db.session.commit()
        return new_appointment

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()