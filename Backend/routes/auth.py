from utils.database import db
from models.User import User
from flask import request, session, jsonify, Blueprint, make_response
import bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json


auth_bp = Blueprint('auth', __name__)

CORS(auth_bp, supports_credentials=True)

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Please provide email and password"}), 403

        user = User.get_single_user(email)
        if not user:
            return jsonify({"message": "No such user"}), 404

        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return jsonify({"message": "Invalid email or password"}), 401

        # ✅ Convert identity to a JSON-serializable object
        identity_data = json.dumps({
            "user_id": str(user.id),
            "company_name": user.company_name
        })

        print(f"🔍 Identity Data Before Token Generation: {identity_data}")  # ✅ Debug

        access_token = create_access_token(identity=identity_data)

        return jsonify({
            "message": "Successfully logged in",
            "access_token": access_token,
            "user_id": user.id,
            "company_name": user.company_name
        }), 200

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
