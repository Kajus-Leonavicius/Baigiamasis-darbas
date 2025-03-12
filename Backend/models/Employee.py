from utils.database import db

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_name = db.Column(db.String(255), db.ForeignKey("users.company_name"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    surname = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), unique=True, nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=True)
    role = db.Column(db.String(255), nullable=True)
    
    def __init__(self, name, surname, phone, email, role, company_name):
        self.name = name
        self.surname = surname
        self.phone = phone
        self.email = email
        self.role = role
        self.company_name = company_name
    
    @staticmethod
    def get_all_employees(company_name):
        query = db.session.query(Employee)
        employees = query.filter(Employee.company_name == company_name)
        return query.all()
    
    @staticmethod 
    def create_new_employee(data):
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
