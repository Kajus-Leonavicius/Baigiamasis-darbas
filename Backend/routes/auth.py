from utils.database import db
from models.User import User
from models.Employee import Employee
from flask import request, session, jsonify, Blueprint, make_response
import bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json


auth_bp = Blueprint('auth', __name__)

CORS(auth_bp, supports_credentials=True)

from models.Employee import Employee
from models.User import User
import bcrypt
from flask import request, session, jsonify

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Please provide email and password"}), 403

        employee = Employee.get_single_employee(email)
        if employee and employee.password and bcrypt.checkpw(password.encode("utf-8"), employee.password.encode("utf-8")):
            access_token = create_access_token(identity=json.dumps({
            "user_id": employee.id,
            "role": employee.role,
            "company_name": employee.company_name
        }))

            print (employee)
            return jsonify({
                "message": "Logged in as employee",
                "access_token": access_token,
                "company_name": employee.company_name,
                "name": employee.name,
                "role": employee.role,
                "surname": employee.surname
            }), 200

        user = User.get_single_user(email)
        if user and user.password and bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            access_token = create_access_token(identity=json.dumps({
            "user_id": user.id,
            "company_name": user.company_name
            
        }))
            return jsonify({
                "message": "Logged in as company owner",
                "access_token": access_token,
                "name": user.name,
                "role": 'owner',
                "surname": user.surname,
                "company_name": user.company_name,
            }), 200

        return jsonify({"message": "netinkamas slaptažodis arba prisijungimo vardas"}), 401

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Internal error occurred"}), 500


    
@auth_bp.route("/register", methods = ["POST"])
def register ():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        surname = data.get("surname")
        phone = data.get("phone")
        company_name = data.get("company_name")
        
        if not all([email, password, name, surname, phone, company_name]):
            return jsonify({"message": "Please provide all required fields"}), 400

        if User.get_single_user(email):
            return jsonify({"message": "Email already in use"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        create_user = User.create_user({
            'name':name, 
            'email':email, 
            'password': hashed_password, 
            'surname':surname, 
            'phone':phone, 
            'company_name':company_name,
            })
        
        return jsonify({"message": "user created"}), 201

    except Exception as e:
        print(f"error: {str(e)}")
        return jsonify({"message": "internal error occured"}), 500
    
@auth_bp.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@auth_bp.route("/session", methods=["GET"])
def check_session():
    if "user_id" in session:
        return jsonify({"user_id": session["user_id"]})
    return jsonify({"error": "Not logged in"}), 401

@auth_bp.route("/debug_session", methods=["GET"])
def debug_session():
    return jsonify(dict(session)), 200
