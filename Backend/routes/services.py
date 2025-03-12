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

    services = Service.get_all()

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

"""@services_bp.route("/add_new", methods=["POST"])
def create_service_or_appointment():
    try:
    except Exception as e:
        return jsonify({'error': 'internal error ocured'})"""