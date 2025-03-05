from utils.database import db
from models.User import User
from flask import request, session, jsonify, Blueprint
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/login", methods = ["POST"])
def login ():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"message": "please provide email and password"}), 403
        
        user = User.get_singele_user(email)
        if not user:
            return jsonify({"message": "no such user"}), 404
        
        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return jsonify({"message": "Invalid email or password"}), 401
        
        session["user_id"] = user.id
        session["company_name"] = user.company_name
        session["role"] = user.role

        return jsonify({"message": "Successfully logged in"}), 200
    
    except Exception as e:
        print(f"error: {str(e)}")
        return jsonify({"message": "internal error occured"}), 500
    
@auth_bp.route("/register", methods = ["POST"])
def register ():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        surname = data.get("surname")
        phone = data.get("phone")
        role = data.get("role")
        specialization = data.get("specialization")
        company_name = data.get("company_name")
        
        if not all([email, password, name, surname, phone, role]):
            return jsonify({"message": "Please provide all required fields"}), 400

        if User.get_singele_user(email):
            return jsonify({"message": "Email already in use"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        user = User(
            name=name, 
            email=email, 
            password=hashed_password, 
            surname=surname, 
            phone=phone, 
            role=role, 
            specialization=specialization,
            company_name=company_name)
        
        create_user = User.create(user)
        
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
        return jsonify({"user_id": session["user_id"], "role": session["role"]})
    return jsonify({"error": "Not logged in"}), 401
