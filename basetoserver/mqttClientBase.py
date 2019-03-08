#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#
# Distributed under terms of the MIT license.

"""
This file is supposed to be used for publishing messages to the server.
In the future this could possibly be merged with mqttClientServer.
Refer to mqttClientServer for more info.
"""
import paho.mqtt.client as mqtt
from datetime import datetime
from dataObj import Data
class MqttClient(mqtt.Client):
    def __init__(self):
        mqtt.Client.__init__(self)
        self.connect("138.197.156.151", 1883, 60)
        
    def on_connect(self, mqttc, obj, flags, rc):
        print("rc: "+str(rc))
        return 0

    def publish_sensor_reading(self, data_obj_lists):
        for data in data_obj_lists:
            payload = data.getJSON()
            self.publish("sensors/%s"%data.str_type,payload,1)
            print("sensors/%s"%data.str_type)
        return 0

if __name__ == "__main__":
    test = MqttClient()
    methane_data_test = [Data("methane",1,1,1,datetime.now(),123),Data("amonia",1,1,1,datetime.now(),36)]
    test.publish_sensor_reading(methane_data_test)
