from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from models.User import User
from utils.database import db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register(): 
    try:
        data = request.get_json()
        password = data.get('password')
        email = data.get('email')
        name = data.get('name')
        surname = data.get('surname', None)
        role = data.get('role', "Customer")
        created_at = data.get('created_ay', None)
        
        hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
        
        if not email or not password:
            return jsonify({'message': 'password and emai are required'}),400
        
        user = User(email = email, password = hashed_password, name=name, surname=surname, role=role, created_at=created_at)
        
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'new user registered'}), 201
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'message': 'internal error acured'}), 500
    
    
@auth_bp.route('/login', methods = ['POST'])
def login ():
    try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({'message': 'email and password required'}),404
            
            user  = User.query.filter_by(email = email).first()
            
            if not user : 
                return jsonify({'message': 'invalid email, please try again'}), 404
            
            if check_password_hash(user.password, password):
                access_token = create_access_token(identity = {"email": user.email})
                return jsonify({'message': 'succesfuly loged in', 'token': access_token}), 201
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'message': 'internal error occured'}),500