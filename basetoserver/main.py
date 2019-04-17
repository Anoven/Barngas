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
from mqttClientBase import MqttClient, MqttClientSensorServer
import threading
import os
from time import *
mqtt_client = None
data_client = None


def run_mqtt_client():
    global mqtt_client
    mqtt_client = MqttClient(1)
    rc = 0
    while rc == 0:
        rc = mqtt_client.loop()


def run_data_client():
    global data_client
    data_client = MqttClientSensorServer()
    rc = 0
    while rc == 0:
        rc = data_client.loop()


def run_hardware():
    global mqtt_client
    while True:
        if (mqtt_client != None):
            if (not mqtt_client.sensor_cmds.empty()):
                print(mqtt_client.sensor_cmds.get().command)
        sleep(0.5)  # 500 ms should be more than enough for our applications


def run_sys():
    global mqtt_client, data_client
    while True:
        if(mqtt_client != None and data_client != None):
            if(not mqtt_client.base_cmds.empty()):
                parsedCmd = mqtt_client.base_cmds.get()
                print(parsedCmd.command)
                if (parsedCmd.command == "update"):
                    timeout = 20        # timeout after 10 seconds
                    while (timeout > 0):
                        # wait till all the data points are recorded and then we can update firmware
                        if (data_client.data_points.empty()):
                            os.system(
                                "/home/pi/Barngas/basetoserver/scripts/updatefirmware.sh")
                            break
                        timeout -= 1
                        sleep(0.5)
                    if (timeout <= 0):
                        print("update command recvd but ignored to save data")
        sleep(0.5)


def run_data_collector():
    global data_client
    while True:
        if (data_client != None):
            if(not data_client.data_points.empty()):
                mqtt_client.publish_sensor_reading(
                    [data_client.data_points.get()])
        sleep(0.1)  # update the data more frequently!


if __name__ == "__main__":
    mqtt_t = threading.Thread(target=run_mqtt_client)
    mqtt_data_t = threading.Thread(target=run_data_client)
    hardware_t = threading.Thread(target=run_hardware)
    sys_t = threading.Thread(target=run_sys)
    data_t = threading.Thread(target=run_data_collector)
    mqtt_t.start()
    mqtt_data_t.start()
    hardware_t.start()
    sys_t.start()
    data_t.start()
