from flask import Blueprint, request, jsonify, session
from sqlalchemy import func
from utils.database import db
from models.User import User
from models.Vehicle import Vehicle
from models.Services import Service
from models.Comments import Comment
from models.Appointments import Appointment
from datetime import timedelta, datetime
from sqlalchemy.orm import aliased
from models.associations import appointment_services

appointment_bp = Blueprint("appointments", __name__)

@appointment_bp.route("/get_appointments", methods=["GET"])
def get_appointments():
    try:
        Client = aliased(User)
        Employee = aliased(User)
        Comment_alias = aliased(Comment)
        User_alias = aliased(User)

        appointments = (
            db.session.query(Appointment, Client, Employee, Vehicle, Comment_alias, User_alias)
            .select_from(Appointment)
            .join(Client, Appointment.client_id == Client.id)
            .outerjoin(Employee, Appointment.employee_id == Employee.id)
            .join(Vehicle, Appointment.vehicle_VIN == Vehicle.VIN)
            .outerjoin(Comment_alias, Appointment.id == Comment_alias.appointment_id)
            .outerjoin(User_alias, User_alias.id == Comment_alias.user_id)
            .all()
        )

        data_dict = {}

        for a, client, employee, vehicle, comment, cuser in appointments:
            if a.id not in data_dict:
                data_dict[a.id] = {
                    "id": a.id,
                    "date": str(a.datetime),
                    "end_date": str(a.end_datetime),
                    "status": a.status,
                    "Client": {
                        "name": client.name,
                        "surname": client.surname,
                        "phone": client.phone,
                        "email": client.email,
                    },
                    "Employee": {
                        "name": employee.name if employee else "Unassigned",
                        "surname": employee.surname if employee else "Unassigned",
                        "role": employee.role if employee else "Unassigned"
                    },
                    "Vehicle": {
                        "VIN": vehicle.VIN,
                        "make": vehicle.make,
                        "model": vehicle.model,
                        "year": vehicle.year,
                        "engine": vehicle.engine,
                        "KW": vehicle.Kw,
                        "license_plate": vehicle.license_plate
                    },
                    "comments": [],
                    "services": []
                }

            if comment:
                data_dict[a.id]["comments"].append({
                    "text": comment.text,
                    "User": {
                        "name": cuser.name if cuser else "Unknown",
                        "surname": cuser.surname if cuser else "Unknown"
                    }
                })

        # Fetch and Add Services for Each Appointment
        all_appointments = list(data_dict.values())
        for appointment in all_appointments:
            appointment_id = appointment["id"]
            services = (
                db.session.query(Service)
                .join(appointment_services, Service.id == appointment_services.c.service_id)
                .filter(appointment_services.c.appointment_id == appointment_id)
                .all()
            )

            appointment["services"] = [
                {
                    "id": service.id,
                    "title": service.service_name,
                    "description": service.description,
                    "duration": service.duration,
                    "status": service.status
                }
                for service in services
            ]

        return jsonify(all_appointments)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Internal error"}), 500

@appointment_bp.route('/create_appointment', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        email = data.get('email')

        # Check if customer exists
        user = User.query.filter_by(email=email).first()
        if user:
            customer_id = user.id
        else:
            new_customer = User(
                name=data.get("name"),
                surname=data.get("surname"),
                phone=data.get("phone"),
                email=email
            )
            db.session.add(new_customer)
            db.session.commit()
            customer_id = new_customer.id

        # Convert date
        date_str = data.get("date")
        formatted_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")

        # Create or Get Vehicle
        vehicle = Vehicle.query.filter_by(VIN=data.get("VIN")).first()
        if not vehicle:
            vehicle = Vehicle(
                make=data.get("make"),
                model=data.get("model"),
                year=data.get("year"),
                VIN=data.get("VIN"),
                license_plate=data.get("license_plate"),
                engine=data.get("engine"),
                Kw=data.get("KW"),
            )
            db.session.add(vehicle)
            db.session.commit()

        # Create new appointment
        new_appointment = Appointment(
            client_id=customer_id,
            vehicle_VIN=vehicle.VIN,
            datetime=formatted_date,
            status=data.get("status", "scheduled"),
            employee_id=data.get("employee_id")
        )
        db.session.add(new_appointment)
        db.session.commit()

        # Assign Services to Appointment
        selected_service_ids = data.get("services", [])
        services = Service.query.filter(Service.id.in_(selected_service_ids)).all()
        new_appointment.services.extend(services)

        db.session.commit()

        return jsonify({'message': 'Appointment created successfully'}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Internal error occurred"}), 500

