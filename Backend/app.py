from flask import Flask, jsonify, request, session
import os
import psycopg2
from flask_cors import CORS
from psycopg2.extras import NamedTupleCursor 

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)

DB_HOST = "localhost"
DB_NAME = "BD"
DB_USER = "postgres"
DB_PASSWORD = "169458"

def connection ():
    return psycopg2.connect(
        host = DB_HOST,
        database = DB_NAME,
        user = DB_USER,
        password = DB_PASSWORD
    )


@app.route ('/api/Login', methods= ['POST'])
def login ():
    try:
        conn = connection()
        cursor = conn.cursor(cursor_factory=NamedTupleCursor)
        
        data = request.get_json()
        
        email= data.get('email')      
        password = data.get('password')
        
        if not email or  not password : 
            return jsonify({'message': 'error no email and password provided'}),400

        
        query = 'SELECT * FROM public."Vartotojas" WHERE email = %s'
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        print(user)

        if user and user.Slaptazodis == password:
            session['user_id'] = user.ID
            return jsonify({'message': 'sekmingai prisijungta', 'user': user.Vardas}), 200
    except Exception as e:
        print("ERROR: ", str(e) )
        return jsonify({'message': 'error occured', 'error': str(e)}), 500
        

if __name__ == '__main__':
    app.run(debug=True)
