from models.Services import Service
from models.Appointments import Appointment
from flask import session, jsonify, request, Blueprint

services_bp = Blueprint("services", __name__)

@services_bp.route("/get_services", methods=["GET"])
def get_services():

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

@services_bp.route("/add_new", methods=["POST"])
def create_service_or_appointment():
    data = request.json
    if "service_name" in data:
        new_service = Service.create(data)
        return jsonify({"message": "Service created", "service_id": new_service.id}), 201
    else:
        new_appointment = Appointment.create(data)
        return jsonify({"message": "Appointment created", "appointment_id": new_appointment.id}), 201
