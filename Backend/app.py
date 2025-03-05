from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_bcrypt import Bcrypt
from utils.database import db
from models.Schedule import Schedule
from models.Appointments import Appointment
from models.User import User
from models.Services import Service
from models.Vehicle import Vehicle
from models.Comments import Comment
from routes.services import services_bp
from routes.appointments import appointment_bp
from flask_migrate import Migrate
from flask_cors import CORS
from routes.users import user_bp
from routes.comments import comment_bp

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root@127.0.0.1:9000/autoservisas"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "super-secret-key"


db.init_app(app)
bcrypt = Bcrypt(app)
Session(app)
Migrate(app, db)
CORS(app)

app.register_blueprint(services_bp, url_prefix="/api/services")
app.register_blueprint(appointment_bp, url_prefix="/api/appointments")
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(comment_bp, url_prefix="/api/comments")


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
