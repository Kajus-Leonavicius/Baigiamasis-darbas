from utils.database import db
from models import User, Vehicle, Service, Comment
from models.Employee import Employee
from models.Customers import Customer
from models.associations import appointment_services, appointment_employees
from sqlalchemy.orm import joinedload
from datetime import timedelta, datetime
from sqlalchemy.orm import aliased
from flask import session
from flask import session
from sqlalchemy.orm import joinedload

class Appointment(db.Model):
    __tablename__ = "appointments"
    
    id = db.Column(db.Integer, primary_key=True)
    datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default="scheduled")
    company_name = db.Column(db.String(255), db.ForeignKey("users.company_name"), nullable=False)

    client_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)
    vehicle_VIN = db.Column(db.String(17), db.ForeignKey('vehicles.VIN'), nullable=False)

    client = db.relationship("Customer", foreign_keys=[client_id])
    employees = db.relationship("Employee", secondary=appointment_employees, backref="appointments")
    vehicle = db.relationship("Vehicle", foreign_keys=[vehicle_VIN])
    services = db.relationship("Service", secondary=appointment_services, backref="appointments")

    comments = db.relationship("Comment", backref="appointment", cascade="all, delete-orphan")



    def __init__(self, client_id, vehicle_VIN,company_name, datetime, status="scheduled", employee_id=None,):
        self.client_id = client_id
        self.vehicle_VIN = vehicle_VIN
        self.datetime = datetime
        self.status = status
        self.employee_id = employee_id
        self.company_name=company_name

    @staticmethod
    def get_all(current_company_name):

        return db.session.query(Appointment, Customer, Vehicle)\
            .join(Customer, Appointment.client_id == Customer.id)\
            .join(Vehicle, Appointment.vehicle_VIN == Vehicle.VIN)\
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
            .join(Vehicle, Appointment.vehicle_VIN == Vehicle.VIN)\
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

            # ✅ Fetch or Create Customer (Not User)
            customer = Customer.query.filter_by(email=email).first()
            if not customer:
                customer = Customer(
                    name=data.get('name'),
                    surname=data.get('surname'),
                    phone=data.get('phone'),
                    email=email,
                    company_name=data.get('company_name')
                )
                db.session.add(customer)
                db.session.commit()

            # ✅ Fetch or Create Vehicle (Ensuring It Belongs to Customer)
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
                    customer_id=customer.id  # ✅ Ensure vehicle is linked to the correct customer
                )
                db.session.add(vehicle)
                db.session.commit()

            # ✅ Convert Date
            date_str = data.get("date")
            formatted_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")

            # ✅ Create Appointment
            new_appointment = Appointment(
                client_id=customer.id,  # ✅ Use Customer ID, not User ID
                vehicle_VIN=vehicle.VIN,
                datetime=formatted_date,
                status=data.get("status", "scheduled"),
                company_name= data.get('company_name')
            )
            db.session.add(new_appointment)

            # ✅ Assign Employees (Now from Employee Table)
            employee_ids = data.get("employee_ids", [])
            if isinstance(employee_ids, int):  # Convert single ID into a list
                employee_ids = [employee_ids]

            employees = Employee.query.filter(Employee.id.in_(employee_ids)).all()
            new_appointment.employees.extend(employees)

            # ✅ Assign Services
            selected_service_ids = data.get("services", [])
            services = Service.query.filter(Service.id.in_(selected_service_ids)).all()
            new_appointment.services.extend(services)

            db.session.commit()

            return {"message": "Appointment created successfully", "appointment_id": new_appointment.id}, 201

        except Exception as e:
            db.session.rollback()  # ✅ Prevents partial commits if an error occurs
            print(f"Error in create_appointment(): {str(e)}")
            return {"message": "Internal error occurred", "error": str(e)}, 500  # ✅ Always return a response


    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()