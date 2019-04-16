#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#
# Distributed under terms of the MIT license.

"""
This class is supposed to be used to simplify all the object data to one place

dataObj Json convention

{
    sensor_id : integer
    group_id : integer
    base_id : integer
    type: string
    time : POSIX timestamp
    value : integer
}

"""
from datetime import datetime
import json

class Data:
    def __init__ (self, str_type, sensor_id, group_id, base_id, time, value):
        self.str_type = str_type
        self.sensor_id = sensor_id
        self.group_id = group_id
        self.base_id = base_id
        self.time = time
        self.value = value
        self.year = time.year
        self.month = time.month
        self.day = time.day
        self.hour = time.hour
        self.time_str = time.isoformat()
    
    def parseJSON(self,msg):
        try:
            if (type(msg) == bytes):
                msg = msg.decode("utf-8")
            tmp_json = json.loads(msg)
            self.sensor_id = tmp_json["sensor_id"]
            self.group_id = tmp_json["group_id"]
            self.base_id = tmp_json["base_id"]
            self.time = datetime.fromtimestamp(tmp_json["time"])
            self.str_type = tmp_json["type"]
            self.value = tmp_json["value"]
            self.year = self.time.year
            self.month = self.time.month
            self.day = self.time.day
            self.hour = self.time.hour 
            self.time_str = self.time.isoformat()
        except:
            raise Exception("Invalid Json!")
        return 0

    def getJSON(self):
        tmp_json_dict = { "sensor_id" : self.sensor_id,
                          "group_id" : self.group_id,
                          "type": self.str_type,
                          "base_id" : self.base_id,
                          "time" : datetime.timestamp(self.time),
                          "value" : self.value
                        }
        return json.dumps(tmp_json_dict)

