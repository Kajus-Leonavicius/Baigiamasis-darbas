from utils.extantions import mail
from flask_mail import Message


def send_email (recipient, name, date, company_name):
    succes_message  = Message (
        subject = 'Registracijos patvirtinimas',
        sender = 'kajusleonaviciuss@gmail.com',
        recipients=[recipient],
        body = f""" 
        Sveiki, {name}
            
        Jusų vizitas buvo sekmingai užregistruotas {date}
        
        Ačiū kad pasirinkote mus!
        Pagarbiai, {company_name} komanda
        """
    )
    mail.send(succes_message)