#! /usr/bin/env python

# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#
#

"""
This file is supposed to make writting to the db much easier 
for data coming from basestations. Use the Data class to represent
the point value and pass that in add to the db.
"""
import sys
sys.path.append("../common/")
import pymysql
import pymysql.cursors
from dataObj import Data
from datetime import datetime

class DBData:
    
    def __init__(self, host, port, user, passwd):
        self.conn = pymysql.connect(host= host, port = port, user = user, passwd= passwd, db = "barngas")
        self.c = self.conn.cursor()
    
    def __del__(self):
        self.conn.close()


    def insertDataPoint(self, sensor_obj):
        '''
        @brief use this function to insert a data value
        '''
        self.c.execute("INSERT INTO raw_data (value, year, month, day, hour, createdAt, updatedAt, sensor_id, group_id, basestation_id) VALUES(%f, %d, %d, %d, %d, '%s', %s, %d, %d, %d);"%(sensor_obj.value, sensor_obj.year, sensor_obj.month, sensor_obj.day, sensor_obj.hour, str(sensor_obj.time_str), 'NOW()', sensor_obj.sensor_id,sensor_obj.group_id, sensor_obj.base_id))
        self.conn.commit()
        return 0
    
    def deleteDataPoint(self,sensor_obj):
        '''
        @brief use this function to delete data points between a time range
        '''
        self.conn.commit()
        return 0
    
    def deleteDataId(self, id_value):
        '''
        @brief debug function that makes it easier to delete a value based of id from mysql table
        '''
        self.conn.commit()
        return 0

if __name__ == "__main__":
    test = DBData("localhost", 3306, "admin", "stemyleafy")
    t_now = datetime.now()
    point_1 = Data("methane",1,2,2,t_now, 54)    
    test.insertDataPoint(point_1)
