from utils.database import db
import bcrypt

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_name = db.Column(db.String(255), db.ForeignKey("users.company_name"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    surname = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), unique=False, nullable=True)
    email = db.Column(db.String(255), unique=False, nullable=True)
    role = db.Column(db.String(255), nullable=True)
    password = db.Column (db.String(255), nullable=True,)
    
    def __init__(self, name, surname, phone, email, role, company_name, password):
        self.name = name
        self.surname = surname
        self.phone = phone
        self.email = email
        self.role = role
        self.company_name = company_name
        self.password = password
    
    @staticmethod
    def get_all_employees(company_name):
        query = db.session.query(Employee).filter(Employee.company_name == company_name)
        return query.all()
    
    @staticmethod
    def get_single_employee(email):
        query = db.session.query(Employee)
        return query.filter_by(email = email).first()
    
    @staticmethod 
    def create_new_employee(data):
        if "password" in data and data['password']:
            hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            data['password'] = hashed_pw
        new_employee = Employee(**data)
        db.session.add(new_employee)
        db.session.commit()
        return new_employee
    
    @staticmethod
    def delete_employee(employee_id):
        employee = Employee.query.get(employee_id)
        if not employee:
            return {"message": "Employee not found"}, 404 

        db.session.delete(employee)
        db.session.commit()
        return {"message": "Employee deleted successfully"}
