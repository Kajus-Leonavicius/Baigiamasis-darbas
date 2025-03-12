from utils.database import db

class Schedule(db.Model):
    __tablename__ = "schedule"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hours_booked = db.Column(db.Integer, default=0)

    employee = db.relationship("User", backref="schedule")
    #appointments = db.relationship("Appointment", secondary=schedule_appointment, backref="schedules")

    def __init__(self, employee_id, date, hours_booked=0):
        self.employee_id = employee_id
        self.date = date
        self.hours_booked = hours_booked
        
    @staticmethod
    def get_all(filters={}):
        if "employee_id" in filters:
            query = Schedule.query.filter_by(employee_id=filters["employee_id"])
        return Schedule.query.all()

    @staticmethod
    def create(data):
        new_schedule = Schedule(**data)
        db.session.add(new_schedule)
        db.session.commit()
        return new_schedule

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()