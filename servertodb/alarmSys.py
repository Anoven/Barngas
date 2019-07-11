#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#

"""
This file is to manage the logic behind checking the alarm objects.
This file should not be used to send the alarm! It should only look at
the data from the basestation, then create a string and use that send the messages!

This class extends the Alarm interface, which actually sends the message, 
since we used it multiple times and there is no point in re-writting that.
"""
import sys
sys.path.append("../common/")
import os
from datetime import datetime
from dataObj import Data
from dbinterface import DBData
from alarmInterface import AlarmInterface



class  AlarmSys(AlarmInterface):
    def __init__(self):
        AlarmInterface.__init__(self)
    def __del__(self):
        AlarmInterface.__del__(self)
    def sendMessage(self, dataValue):
        sql_data = DBData("localhost", 3306, os.environ['SQLUSER'],os.environ['SQLPASS']) 
        sensor = sql_data.getSensor(dataValue.sensor_id)
        for user in sql_data.getUsers():
            msg = """Attention!
The reading from the following sensor is reporting a unusual value.
Sensor
    sensor name: %s
    sensor description: %s
    sensor type: %s
    sensor reading: %.2f
Time: %s
We advise you to look into it further.
Harvest Measurement
            """%(sensor[2], sensor[3], sensor[1], dataValue.value, dataValue.time_str)
            print("msg: ", msg)
        
            self.sendEmail(user[5], msg)
            self.sendSMS(user[6], msg)
    
    def checkValue(self, dataValue):
        sql_data = DBData("localhost", 3306, os.environ['SQLUSER'],os.environ['SQLPASS']) 
        sensor = sql_data.getSensor(dataValue.sensor_id)
        if (sensor[8] != None and dataValue.value > sensor[8]):
            self.sendMessage(dataValue)

if __name__ == "__main__":
    alarm_logic = AlarmSys()
    dataValue = Data("CARBON DIOXIDE",595546573,1,1,datetime.now(), 501)
    alarm_logic.checkValue(dataValue)



