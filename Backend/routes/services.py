from models.Service import Service
from models.Appointments import Appointment
from flask import session, jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

services_bp = Blueprint("services", __name__)

@services_bp.route("/get_services", methods=["GET"])
@jwt_required()
def get_services():
    
    raw_identity = get_jwt_identity()

    user_identity = json.loads(raw_identity)
    user_id = user_identity["user_id"]
    company_name = user_identity["company_name"]

    services = Service.get_all(company_name=company_name)

    return jsonify([
        {
            "id": s.id,
            "service_name": s.service_name,
            "description": s.description,
            "duration": s.duration,
            "status": s.status
        }
        for s in services
    ])

@services_bp.route('/create_service', methods=['POST'])
@jwt_required()
def create_new_service():
    try:
        raw_identity = get_jwt_identity()
        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]
        
        data = request.json
        
        if not data:
            return jsonify({'message': 'no data provided'}),400
        
        new_service = Service.create_new_service({
            "service_name": data.get('service_name'),
            "description": data.get('description'),
            "duration": data.get('duration'),
            "status": data.get('status'),
            "company_name": company_name,
        })

        
        print(new_service)
        
        if not new_service:
            return({'message': 'failed to create new employee'})
        
        return jsonify({'message': 'new employee created', "employee_id":new_service.id })
    
    except Exception as e:
        print(f'error: {str(e)}')
        return jsonify({'message': 'internal error ocured'}), 500
    
@services_bp.route('/delete_service/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    try:
        raw_identity = get_jwt_identity()
        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]
        
        return Service.delete_service(service_id)
    except Exception as e: 
        print(f"error occured {str(e)}")
        return jsonify({'message': 'internal error occured'})
    