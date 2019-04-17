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
import sys
sys.path.append("../common")
from queue import Queue
from cmdParser import BaseCmd, SensorCmd
from dataObj import Data
from datetime import datetime
import paho.mqtt.client as mqtt


class MqttClient(mqtt.Client):
    sensor_cmds = Queue(25)
    base_cmds = Queue(25)

    def __init__(self, base_id):
        mqtt.Client.__init__(self)
        self.connect("138.197.156.151", 1883, 60)
        self.subscribe([("basestation/"+str(base_id)+"/basecmd", 2),
                        ("basestation/"+str(base_id)+"/sensorcmd", 2)])
        self.message_callback_add(
            "basestation/"+str(base_id)+"/basecmd", self.on_base_cmd)
        self.message_callback_add(
            "basestation/"+str(base_id)+"/sensorcmd", self.on_sensor_cmd)

    def on_connect(self, mqttc, obj, flags, rc):
        print("rc: "+str(rc))
        return 0

    def publish_sensor_reading(self, data_obj_lists):
        for data in data_obj_lists:
            payload = data.getJSON()
            self.publish("sensors/%s" % data.str_type, payload, 2)
            print("sensors/%s" % data.str_type)
        return 0

    def on_base_cmd(self, mqttc, obj, msg):
        print("basestation comamnd recvd" + str(msg.payload))
        parsedCmd = BaseCmd(msg.payload)
        try:
            self.base_cmds.put(parsedCmd, timeout=5)
        except Exception as e:
            print("Exception:" + str(e))
        return 0

    def on_sensor_cmd(self, mqttc, obj, msg):
        print("sensor command recvd"+str(msg.payload))
        parsedCmd = SensorCmd(msg.payload)
        try:
            self.sensor_cmds.put(parsedCmd, timeout=5)
        except Exception as e:
            print("Exception: " + str(e))
        return 0

    def on_message(self, mqttc, obj, msg):
        print(msg.payload)
        return 0


class MqttClientSensorServer(mqtt.Client):
    data_points = Queue(50)

    def __init__(self):
        mqtt.Client.__init__(self)
        print("data client")
        self.connect("localhost", 1883, 60)
        self.subscribe("sensor/+", 2)
        self.message_callback_add("sensor/+", self.on_sensor_data)

    def on_connect(self, mqttc, obj, flags, rc):
        print("data client rc: "+str(rc))
        return 0

    def on_sensor_data(self, mqttc, obj, msg):
        print("sensor data recvd" + str(msg.payload))
        # temporary array the parse should overwrite
        datapoint = Data("temp", 1, 1, 1, datetime.now(), -1)
        try:
            datapoint.parseJSON(msg.payload)
            self.data_points.put(datapoint, timeout=5)
        except Exception as e:
            print("Exception: ", str(e))


if __name__ == "__main__":
    test = MqttClient(1)
    methane_data_test = [Data("methane", 1, 1, 1, datetime.now(), 123), Data(
        "amonia", 1, 1, 1, datetime.now(), 36)]
    # test.publish_sensor_reading(methane_data_test)
    rc = 0
    while rc == 0:
        rc = test.loop()
