from utils.database import db

user_service = db.Table(
    "user_service",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("service_id", db.Integer, db.ForeignKey("service.id"), primary_key=True)
)

appointment_services = db.Table(
    'appointment_services',
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id'), primary_key=True),
    db.Column('service_id', db.Integer, db.ForeignKey('service.id'), primary_key=True)
)


user_vehicle = db.Table(
    "user_vehicle",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("vehicle_VIN", db.String(17), db.ForeignKey("vehicle.VIN"), primary_key=True)
)

schedule_appointment = db.Table(
    "schedule_appointment",
    db.Column("schedule_id", db.Integer, db.ForeignKey("schedule.id"), primary_key=True),
    db.Column("appointment_id", db.Integer, db.ForeignKey("appointments.id"), primary_key=True)
)