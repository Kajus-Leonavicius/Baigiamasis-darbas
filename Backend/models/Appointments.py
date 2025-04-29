from utils.database import db
from models import User, Vehicle, Service, Comment
from models.Employee import Employee
from models.Customers import Customer
from models.associations import appointment_services, appointment_employees
from sqlalchemy.orm import joinedload
from datetime import timedelta, datetime
from flask_mail import Message
from utils.mails import send_email

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=True)
    company_name = db.Column(db.String(255), db.ForeignKey('users.company_name'), nullable=False)

    client_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)

    client = db.relationship('Customer', foreign_keys=[client_id])
    employees = db.relationship('Employee', secondary=appointment_employees, backref='appointments')
    vehicle = db.relationship('Vehicle', foreign_keys=[vehicle_id])
    services = db.relationship('Service', secondary=appointment_services, backref='appointments')

    comments = db.relationship('Comment', backref='appointment', cascade='all, delete-orphan')



    def __init__(self, client_id, vehicle_id,company_name, datetime, employee_id=None, id=None):
        self.id = id
        self.client_id = client_id
        self.vehicle_id = vehicle_id
        self.datetime = datetime
        self.employee_id = employee_id
        self.company_name=company_name

    @staticmethod
    def get_all(current_company_name):

        return db.session.query(Appointment, Customer, Vehicle)\
            .join(Customer, Appointment.client_id == Customer.id)\
            .join(Vehicle, Appointment.vehicle_id == Vehicle.id)\
            .options(joinedload(Appointment.employees))\
            .options(joinedload(Appointment.services))\
            .options(joinedload(Appointment.comments))\
            .filter(Appointment.company_name == current_company_name).all() 
            
    @property
    def end_datetime(self):
        if self.services:
            total_duration = sum(service.duration for service in self.services)
            return self.datetime + timedelta(minutes=total_duration)
        return self.datetime

    @staticmethod
    def get_single_appointment(appointment_id):
        return db.session.query(Appointment).filter_by(id=appointment_id).first()
    
    @staticmethod
    def get_client_appointments (customer_id):
        customer_appointment =( db.session.query(Appointment, Vehicle)
            .join(Vehicle, Appointment.vehicle_id == Vehicle.id)\
            .options(joinedload(Appointment.services))\
            .options(joinedload(Appointment.employees))\
            .options(joinedload(Appointment.comments))\
            .filter(Appointment.client_id == customer_id)\
            .all()
            )
        return customer_appointment
    
    @staticmethod
    def create_appointment(data):
        try:
            email = data.get('email')
            VIN = data.get('VIN')
            company_name = data.get('company_name')
            
            customer = Customer.query.filter_by(email=email, company_name=company_name).first()

            if not customer:
                customer = Customer(
                    name=data.get('name'),
                    surname=data.get('surname'),
                    phone=data.get('phone'),
                    email=email,
                    company_name=company_name
                )
                db.session.add(customer)
                db.session.commit()

            vehicle = Vehicle.query.filter_by(VIN=VIN, customer_id=customer.id).first()

            if not vehicle:
                vehicle = Vehicle(
                    VIN=VIN,
                    make=data.get('make'),
                    model=data.get('model'),
                    year=data.get('year'),
                    engine=data.get('engine'),
                    Kw=data.get('Kw'),
                    license_plate=data.get('license_plate'),
                    customer_id=customer.id
                )
                db.session.add(vehicle)
                db.session.commit()

            from datetime import datetime
            date_str = data.get("date")
            formatted_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M")

            new_appointment = Appointment(
                client_id=customer.id,
                vehicle_id = vehicle.id,
                datetime=formatted_date,
                company_name=company_name
            )
            db.session.add(new_appointment)

            employee_ids = data.get("employee_ids", [])
            if isinstance(employee_ids, int):
                employee_ids = [employee_ids]

            employees = Employee.query.filter(Employee.id.in_(employee_ids)).all()
            new_appointment.employees.extend(employees)

            selected_service_ids = data.get("services", [])
            services = Service.query.filter(Service.id.in_(selected_service_ids)).all()
            new_appointment.services.extend(services)

            db.session.commit()
            
            send_email(
                recipient=email,
                name = data.get('name'),
                date= formatted_date.strftime('"%Y-%m-%d %H:%M"'),
                company_name=company_name
            )

            return {"message": "Appointment created successfully", "appointment_id": new_appointment.id}, 201

        except Exception as e:
            print(f"Error in create_appointment(): {str(e)}")
            return {"message": "Internal error occurred", "error": str(e)}, 500
        