#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#
# Distributed under terms of the MIT license.

"""
This file is meant to do the logic between mqttClientBase and the hardware.
The mqttClientBase is on a Thread and the hardware control is on another thread. 
The commands comming into the mqttClientBase are stored in the sensor_cmds Queue and 
the base_cmds.
"""
from mqttClientBase import MqttClient
import threading
import os
from time import *
mqtt_client = None

def run_mqtt_client():
    global mqtt_client
    mqtt_client = MqttClient(1)
    rc = 0
    while rc == 0:
        rc = mqtt_client.loop()


def run_hardware():
    global mqtt_client
    while True:
        if (mqtt_client != None):
            if (not mqtt_client.sensor_cmds.empty()):
                print (mqtt_client.sensor_cmds.get().command)
        sleep(0.5) # 500 ms should be more than enough for our applications

def run_sys():
    global mqtt_client
    while True:
        if(mqtt_client!=None):
            if(not mqtt_client.base_cmds.empty()):
                parsedCmd = mqtt_client.base_cmds.get()
                print(parsedCmd.command)
                if (parsedCmd.command == "update"):
                    os.system("/home/pi/Barngas/basetoserver/scripts/updatefirmware.sh")
        sleep(0.5)

if __name__ == "__main__":
    mqtt_t = threading.Thread(target = run_mqtt_client)
    hardware_t = threading.Thread(target = run_hardware)
    sys_t = threading.Thread(target = run_sys)
    mqtt_t.start()
    hardware_t.start()
    sys_t.start()
