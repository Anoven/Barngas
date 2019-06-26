#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#

"""
This class can be used to generalize all the different communication
methods for sending alarms. I.E.  sending email or sending SMS.
The user should extend this interface in the their alarm sys 
which does the checking and generating the message. 
"""
import smtplib
import os
from twilio.rest import Client

DEBUG=False

class AlarmInterface:
    def __init__(self):
        self.twilio_account_sid = os.environ['TWILIOACCOUNTID']
        self.twilio_auth_token = os.environ['TWILIOAUTHTOKEN']
        self.twilio_number = os.environ['TWILIONUMBER']
        self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
   
    def __del__(self):
        pass
    
    def sendEmail(self, email, msg):
        if ("@" not in email):
            return False
        mailServer = smtplib.SMTP('smtp.zoho.com',587)
        mailServer.set_debuglevel(DEBUG)
        mailServer.starttls()
        mail_from = os.environ['ALARMEMAIL']
        mailServer.login(mail_from,os.environ['ALARMEMAILPASS'])  
        email_msg =  """From: %s\nTo: %s\nSubject: %s\n\n%s """ % (mail_from, email, "Harvest Measurement - Alarm", msg)
        mailServer.sendmail(mail_from, email, email_msg)
        mailServer.quit()
   
    def sendSMS(self, phone_number, msg):
        if(not phone_number.isdigit() and not len(phone_number) == 10):
            print("Invalid phone number : %s !"%(phone_number))
            return False
        print("sending message to %s"%(phone_number))
        self.twilio_client.messages.create(to=str(phone_number), from_=self.twilio_number,body=msg)
        return True

if __name__ == "__main__":
    test = AlarmInterface()
#    test.sendSMS("2263502710","this is a test"
    test.sendEmail("vasav.shah97@gmail.com", "this is a test email")
