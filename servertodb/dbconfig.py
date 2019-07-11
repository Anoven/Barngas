#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav@harvestmeasurement.ca>
#
# Distributed under terms of the MIT license.

"""
This program is designed to make adding new sensors and basestations easier.
Once you run the program it should guide you through all the parameters required to make the desired object.
"""
from dbinterface import DBData

BASESTATION = 1
SENSOR = 2
GROUP = 3
USER = 4
EXIT = 5

CREATE = 1
DELETE = 2
LIST = 3 
THRESHOLD = 4
NAME = 5
db = DBData("localhost", 3306, "admin", "stemyleafy")

while True:
    print("""What would you like to create? (1-5)
    %d. Basestation 
    %d. Sensor 
    %d. Group
    %d. User
    %d. Exit"""%(BASESTATION,SENSOR,GROUP,USER,EXIT))
    obj_to_create = None
    try:
        obj_to_create = int(input())
    except ValueError:
        print("please enter in the numerical value")
    
    if obj_to_create == BASESTATION:
        try:
            option = int(input("What would you like to do?\n\t 1. Create \n\t 2. Delete\n\t 3. List\n"))
            if (option == CREATE):
                name = input("Enter name:\n")
                description = input("Enter description:\n")
                db.newBasestation( name, description)
                print("base station created!")
            elif (option == DELETE):
                name = input ("Enter the name of the basestation:\n")
                db.deleteBasestation(name)
                print("Basestation deleted!")
            elif (option == LIST):
                db.listBasestations()
            else:
                print("invalid input")
                break
        except Exception as e:
            print(e)

    elif obj_to_create == SENSOR:
        try:
            option = int(input("What would you like to do?\n\t 1. Create \n\t 2. Delete\n\t 3. List\n\t 4. Threshold\n\t 5. Name\n"))
            if (option == CREATE):
                possible_sensor_types = ["METHANE","TEMP","HUMIDITY","CARBON DIOXIDE","HYDROGEN SULFIDE","AMMONIA"]
                sensor_id = int(input("Enter sensor id:\n"))
                sensor_type = possible_sensor_types[int(input("Sensor type:\n\t 0. METHANE \n\t 1. TEMPERATURE \n\t 2. RELATIVE HUMIDITY \n\t 3. CARBON DIOXIDE \n\t 4. HYDROGEN SULFIDE \n\t 5. AMMONIA\n"))]
                name = input("Enter name:\n")
                description = input("Enter description:\n")
                base_id = int(input("Enter basestation id:\n"))
                group_id = int(input("Enter group id:\n"))
                db.newSensor(sensor_id,sensor_type,name,description,group_id,base_id)
                print("sensor created!")
            elif (option == DELETE):
                sensor_id = int(input("Enter sensor id:\n"))
                db.deleteSensor(sensor_id)
                print("sensor deleted")
            elif (option == LIST):
                db.listSensors()
            elif (option == THRESHOLD):
                sensor_id = int(input("Enter sensor id:\n"))
                threshold = int(input("Enter threshold:\n"))
                db.setThreshold(sensor_id, threshold)
            elif (option == NAME):
                sensor_id = int(input("Enter sensor id:\n"))
                name = input("Enter new name:\n")
                db.updateName(sensor_id,name)
            else:
                print ("invalid input")
                break
        except Exception as e:
            print(e)
    elif obj_to_create == GROUP:
        print("creating new group!")
    elif obj_to_create == USER:
        try:
            option = int(input("What would you like to do?\n\t 1. Create \n\t 2. Delete\n\t 3. List\n"))
            if (option == CREATE):
#                u_name = input("Enter username:\n")
#                f_name = input("Enter first name:\n")
#                l_name = input("Enter last name:\n")
#                email = input("Enter email:\n")
#                phonenumber = input("Enter phone number:\n")
#                password = input("Enter password:\n")
#                db.insertUser(f_name, l_name, email, u_name, phonenumber, password)
#                print("user created!")
                print("not implemented yet use the website!")
            elif (option == DELETE):
                user_id = int(input("Enter the id of the user:\n"))
                db.deleteUser(user_id)
            elif (option == LIST):
                db.listUsers()
            else:
                print("invalid input")
        except Exception as e:
            print(e)

    elif obj_to_create == EXIT:
        break
