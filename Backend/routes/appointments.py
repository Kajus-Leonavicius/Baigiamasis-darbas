from flask import Blueprint, request, jsonify, session
from sqlalchemy import func
from utils.database import db
from models.User import User
from models.Vehicle import Vehicle
from models.Service import Service
from models.Comment import Comment
from models.Appointments import Appointment
from datetime import timedelta, datetime
from sqlalchemy.orm import aliased
from models.associations import appointment_services
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

appointment_bp = Blueprint("appointments", __name__)

from flask import request

@appointment_bp.route("/get_appointments", methods=["GET"])
@jwt_required() 
def get_appointments():
    try:
        raw_identity = get_jwt_identity()


        user_identity = json.loads(raw_identity)
        user_id = user_identity["user_id"]
        company_name = user_identity["company_name"]

        appointments = Appointment.get_all(company_name)

        
        results = []
        for appointment, client, vehicle in appointments: 

            results.append({
                "id": appointment.id, 
                "date": str(appointment.datetime),
                "end_date": str(appointment.end_datetime),
                "client": {
                    "name": client.name,
                    "surname": client.surname,
                    "phone": client.phone,
                    "email": client.email
                },
                "vehicle": {
                    "VIN": vehicle.VIN,
                    "make": vehicle.make,
                    "model": vehicle.model,
                    "year": vehicle.year,
                    "engine": vehicle.engine,
                    "Kw": vehicle.Kw,
                    "license_plate": vehicle.license_plate
                },
                "services": [{"id": s.id, "title": s.service_name, "duration": s.duration} for s in appointment.services],
                "comments": [{"text": c.text, "user": c.user.name if c.user else "Unknown"} for c in appointment.comments],
                "employees": [
                    {"name": e.name, "surname": e.surname, "role": e.role}
                    for e in appointment.employees
                ]
            })
        return jsonify(results), 200

    except Exception as e:
        print(f" ERROR in get_appointments(): {str(e)}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

@appointment_bp.route('/create_appointment', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        response = Appointment.create_appointment(data)
        return jsonify(response)
    except Exception as e:
        print(f'ERROR: {str(e)}')
        return jsonify({"message": "Internal error occurred", "error": str(e)}), 500

