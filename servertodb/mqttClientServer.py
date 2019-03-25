#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#
# Distributed under terms of the MIT license.

"""
This file is to wrap the mqtt logic.
Look at examples on mqtt library usage:
    https://github.com/eclipse/paho.mqtt.python/blob/master/examples/client_sub-multiple-callback.py
    https://pypi.org/project/paho-mqtt/#constructor-reinitialise

All the logic for checking alarms is handled here.
    Right now we only check to a threshold so it works fine, but in the future if we want to 
    do fancy stuff and adapt to the enviornment this will probably need to be re-written.

Message received should be in JSON format and hence we should be directly be able to convert it
the dataObj. This way its easy to add the database using the dbinterface.

Supported Commands:
    sensors/methane
    sensors/amonia
    sensors/temperature
    sensors/hydrogensulfide
    sensors/carbondioxide
    sensors/humidity
    basestation/# --> # = base_id

Note: I know the different callbacks for each sensor may not be necessary, but I decided to do this
      because if the way they are tob e parsed is to change we can do that there.

TODO:
    Add the alarm server logic
    Move the passwords to enviornment variables

"""

import sys
sys.path.append("../common")
import paho.mqtt.client as mqtt
from datetime import datetime
from dataObj import Data
from dbinterface import DBData

class MqttClient(mqtt.Client):
    db_controller = None
    def __init__(self):
        mqtt.Client.__init__(self)
        self.connect("localhost", 1883, 60)
        self.subscribe([("basestation/+/basedata",0),("sensors/methane", 0),("sensors/amonia",0),("sensors/temperature",0),("sensors/hydrogensulfide",0), ("sensors/carbondioxide", 0),("sensors/humidity",0)])
            
        self.message_callback_add("sensors/methane", self.on_message_methane) 
        self.message_callback_add("sensors/amonia", self.on_message_amonia)
        self.message_callback_add("sensors/temperature", self.on_message_temperature)
        self.message_callback_add("sensors/hydrogensulfide", self.on_message_hydrogen_sulfide)
        self.message_callback_add("sensors/carbondioxide", self.on_message_carbon_dioxide)
        self.message_callback_add("sensors/humidity", self.on_message_humidity)
        self.message_callback_add("basestation/#/basedata", self.on_message_basestation)

    def on_connect(self, mqttc, obj, flags, rc):
        self.db_controller = DBData("localhost", 3306, "admin", "stemyleafy")
        print("rc: "+str(rc))

    def on_message_basestation(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))

    def on_message_methane(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
        methane_data = Data("methane",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            methane_data.parseJSON(msg.payload.decode('utf-8')) 
            self.db_controller.insertDataPoint(methane_data)
        except Exception as e:
            print("Exception : ", str(e))
   
    def on_message_amonia(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload)) 
        amonia_data = Data("amonia",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            amonia_data.parseJSON(msg.payload.decode('utf-8')) 
            self.db_controller.insertDataPoint(amonia_data)
        except Exception as e:
            print("Exception : ", str(e))
   
    def on_message_hydrogen_sulfide(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload)) 
        h2so4_data = Data("hydrogensulfide",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            h2so4_data.parseJSON(msg.payload.decode('utf-8')) 
            self.db_controller.insertDataPoint(h2so4_data)
        except Exception as e:
            print("Exception : ", str(e))
   
    def on_message_humidity(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
        humidity_data = Data("humidity",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            humidity_data.parseJSON(msg.payload.decode('utf-8')) 
            self.db_controller.insertDataPoint(humidity_data)
        except Exception as e:
            print("Exception : ", str(e))
   
    def on_message_carbon_dioxide(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
        co2_data = Data("carbondioxide",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            co2_data.parseJSON(msg.payload.decode('utf-8'))
            self.db_controller.insertDataPoint(co2_data)
        except Exception as e:
            print("Exception : ", str(e))
   
    def on_message_temperature(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
        temperature_data = Data("temperature",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            temperature_data.parseJSON(msg.payload.decode('utf-8')) 
            self.db_controller.insertDataPoint(temperature_data)
        except Exception as e:
            print("Exception : ", str(e))

    def on_message(self, mqttc, obj, msg):
        printf("undefined message received")
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
    

if __name__ == "__main__":
    test = MqttClient()
    rc = 0
    while rc == 0:
        rc = test.loop()
