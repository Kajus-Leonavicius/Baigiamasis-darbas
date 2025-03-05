from utils.database import db
from models.User import User
from flask import jsonify, request, session, Blueprint

user_bp = Blueprint('users', __name__)


@user_bp.route('/get_employees', methods=["GET"])
def get_employees():
    try:
        
        employees = User.get_all(filters={"role": "employee"})
        
        if not employees:
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
                "specialization" : employee.specialization
            })
        
        return jsonify(response)
    except Exception as e:
        print(f"error: {str(e)}")
        return jsonify({"meesage": "Internal error"}),500