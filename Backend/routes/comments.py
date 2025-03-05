from utils.database import db
from models.Comments import Comment
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