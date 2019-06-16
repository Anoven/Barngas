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
        self.subscribe([("basestation/+/basedata",2),("sensors/+", 2)])
        
        self.message_callback_add("sensors/+", self.on_message_sensor)
        self.message_callback_add("basestation/+/basedata", self.on_message_basestation)

    def on_connect(self, mqttc, obj, flags, rc):
        self.db_controller = DBData("localhost", 3306, "admin", "stemyleafy")
        print("rc: "+str(rc))

    def on_message_basestation(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))

    def on_message_sensor(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
        data = Data("methane",-1,-1,-1,datetime.now(),-1) # default object since we are parsing from JSON
        try:
            data.parseJSON(msg.payload.decode('utf-8'))
            self.db_controller.insertDataPoint(data)
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
