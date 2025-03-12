from utils.database import db
from models.Employee import Employee
from flask import jsonify, request, session, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

employees_bp = Blueprint('employees', __name__)


@employees_bp.route('/get_employees', methods=["GET"])
@jwt_required()
def get_employees():
    try:
        
        raw_identity = get_jwt_identity()

        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]

        employees = Employee.get_all_employees(company_name=company_name)
        
        
        if not employees:
            print('no employees found')
            return jsonify({"message": "you don't have any employees"})
        
        
        response = []
        for employee in employees:
            response.append({
                "id": employee.id,
                "name": employee.name,
                "surname": employee.surname,
                "phone" : employee.phone,
                "email" : employee.email,
                "role" : employee.role,
            })
        
        return jsonify(response)
    except Exception as e:
        print(f"error: {str(e)}")
        return jsonify({"meesage": "Internal error"}),500
    
@employees_bp.route('/create_employee', methods=['POST'])
@jwt_required()
def create_employee():
    try:
        raw_identity = get_jwt_identity()
        print(raw_identity)
        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]
        
        print(user_id, company_name)
        
        data = request.json
        
        if not data:
            return jsonify({'message': 'no data provided'}),400
        
        new_employee = Employee.create_new_employee({
            'name': data.get('name'),
            'surname': data.get('surname'),
            'role': data.get('role'),
            'phone': data.get('phone'),
            'email': data.get('email'),
            'company_name': data.get('company_name')
        })
        
        print(new_employee)
        
        if not new_employee:
            return({'message': 'failed to create new employee'})
        
        return jsonify({'message': 'new employee created', "employee_id":new_employee.id })
    
    except Exception as e:
        print(f'error: {str(e)}')
        return jsonify({'message': 'internal error ocured'}), 500


@employees_bp.route('/delete_employee/<int:employee_id>', methods=['DELETE'])
@jwt_required()
def delete_employee(employee_id):
    try:
        raw_identity = get_jwt_identity()
        print(raw_identity)
        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]
        
        print(employee_id)
        return Employee.delete_employee(employee_id)
    except Exception as e: 
        print(f"error occured {str(e)}")
        return jsonify({'message': 'internal error occured'})