from utils.database import db
from models import Comment, Appointment
from flask import Blueprint, request, jsonify

comment_bp = Blueprint('comment', __name__)

@comment_bp.route('/get_comments', methods=['GET'])
def get_comments():
    
    comments = Comment.get_all(filter="appointment_id")
    
    if not comments:
        return jsonify({'message': 'no comments yet'})
    
    data= []
    for c in comments:
        data.append({
            'comment': comments.text
        })
    return jsonify(data)

@comment_bp.route('/create_comment', methods=['POST'])
def create_new_comment():
    try:
        data = request.json
        appointment_id = data.get('appointment_id')
        
        appointment = Appointment.get_single_appointment(appointment_id=appointment_id)
        new_comment = data.get('text')
        
        comment = Comment.add_new_comment({'text': new_comment ,'appointment_id': appointment.id})
        
        return jsonify({'message': 'commend succesfuly added', 'comment_id': comment.id}),201
    except Exception as e:
        print(f'error{str(e)}' )
        return jsonify({'message': "internal error occured"}),500