from utils.database import db

class Comment (db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id', ondelete="CASCADE"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=True)
    text = db.Column(db.Text)
    
    appointment = db.relationship('Appointment', backref=db.backref('comments', lazy=True))
    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    
    def __init__(self, appointment_id, text):
        self.appointment_id = appointment_id
        self.text = text
    
    @staticmethod
    def add_new(data):
        new_comment = Comment(**data)
        db.session.add(new_comment)
        db.session.commit()
        return new_comment
    
    @staticmethod
    def get_all(filter={}):
        query = Comment.query
        if "appointment_id" in filter:
            query = query.filter_by(appointment_id=filter["appointment_id"])
        return query.all()