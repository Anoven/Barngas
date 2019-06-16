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
EXIT = 4

CREATE = 1
DELETE = 2
LIST = 3 
db = DBData("localhost", 3306, "admin", "stemyleafy")

while True:
    print("what would you like to create? (1-4)\n \t 1. Basestation \n\t 2. Sensor \n\t 3. Group \n\t 4. Exit")
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
            option = int(input("What would you like to do?\n\t 1. Create \n\t 2. Delete\n\t 3. List\n"))
            if (option == CREATE):
                possible_sensor_types = ["METHANE","TEMP","HUMIDITY","CARBON DIOXIDE","HYDROGEN SULFIDE","AMMONIA"]
                sensor_id = int(input("Enter sensor id:"))
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
                db.listSensors();
            else:
                print ("invalid input")
                break
        except Exception as e:
            print(e)
    elif obj_to_create == GROUP:
        print("creating new group!")
    elif obj_to_create == EXIT:
        break
