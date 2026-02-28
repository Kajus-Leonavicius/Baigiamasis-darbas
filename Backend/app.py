from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from flask_session import Session
from datetime import timedelta

from utils.database import db
from models.Appointments import Appointment
from models.User import User
from models.Service import Service
from models.Vehicle import Vehicle
from models.Comment import Comment
from models import Customer, Employee
from routes.services import services_bp
from routes.appointments import appointment_bp
from routes.auth import auth_bp
from routes.employees import employees_bp
from routes.comments import comment_bp
from routes.customers import customer_bp
import os
from flask_jwt_extended import JWTManager
from utils.extantions import mail

app = Flask(__name__)
# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root@127.0.0.1:9000/autoservisas"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = "your_very_secure_secret"
app.config["JWT_IDENTITY_CLAIM"] = "sub"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'kajusleonaviciuss@gmail.com'
app.config['MAIL_PASSWORD'] = 'abqj roxj jirg javv'

mail.init_app(app)
jwt = JWTManager(app)

CORS(app, supports_credentials=True)

db.init_app(app)
bcrypt = Bcrypt(app)
Migrate(app, db)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(services_bp, url_prefix="/api/services")
app.register_blueprint(appointment_bp, url_prefix="/api/appointments")
app.register_blueprint(employees_bp, url_prefix="/api/employees")
app.register_blueprint(comment_bp, url_prefix="/api/comments")
app.register_blueprint(customer_bp, url_prefix="/api/customers")




with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
