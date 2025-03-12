from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Customers import Customer
from models.Appointments import Appointment
import json

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/get_customers', methods=['GET'])
@jwt_required()
def get_customers():
    try:
        raw_identity = get_jwt_identity()

        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]
        
        customers = Customer.get_customers(company_name=company_name)
        
        result =[]
        
        for customer in customers:
            result.append({
                'id': customer.id,
                "name": customer.name,
                "surname": customer.surname,
                "phone": customer.phone,
                'email': customer.email
            })
        
        return jsonify(result)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'message': 'internal error ocurred'}),500

@customer_bp.route('/get_customer_appointments/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer_appointments(customer_id):
    try:
        raw_identity = get_jwt_identity()

        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]
        
        customer_appointments = Appointment.get_client_appointments(customer_id=customer_id)  
        
        
        result =[]
        for app, vehicle in customer_appointments:
            result.append({
                "id": app.id,
                "date": app.datetime,
                "status": app.status,
                "Vehicle":{
                    "VIN": vehicle.VIN,
                    "make": vehicle.make,
                    "model": vehicle.model,
                    "year": vehicle.year,
                    "license_plate": vehicle.license_plate,
                }, 
                "services": [{"title": s.service_name} for s in app.services],
                "comments": [{"text": c.text, "user": c.user.name if c.user else "Unknown"} for c in app.comments],
                "employees": [{"name": e.name, "surname": e.surname, "role": e.role}for e in app.employees]
            })
        return jsonify(result)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'message': 'internal error ocurred'}),500
