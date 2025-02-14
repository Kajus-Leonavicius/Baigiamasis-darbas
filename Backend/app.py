from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    response = jsonify({"message": "Sveiki atvykę į Flask API!"})
    response.headers['Content-Type'] = 'application/json'
    return response

if __name__ == '__main__':
    app.run(debug=True)
