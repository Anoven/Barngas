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
import bcrypt
from dataObj import Data
from datetime import datetime

class DBData:
    
    def __init__(self, host, port, user, passwd):
        self.conn = pymysql.connect(host= host, port = port, user = user, passwd= passwd, db = "barngas")
        self.c = self.conn.cursor()
    
    def __del__(self):
        self.conn.close()

    def newBasestation(self, name,description):
        self.deleteBasestation(name)
        self.c.execute('INSERT INTO basestations (name, description, createdAt,updatedAt,user_id) VALUES("%s","%s",%s,%s,%d);'%(str(name), str(description),"NOW()","NOW()",1))
        self.conn.commit()

    def newSensor(self, sensor_id, str_type, name, description, group_id, base_id):
        self.deleteSensor(sensor_id)
        possible_sensors = ["METHANE","TEMP","HUMIDITY","HYDROGEN SULFIDE","AMMONIA", "CARBON DIOXIDE"]
        if str_type not in possible_sensors:
            print("invalid name!")
            return 
        self.c.execute('INSERT INTO sensors VALUES (%d,"%s","%s","%s",NOW(),NOW(),%d,%d,NULL);'%(sensor_id, str_type, name,description, group_id, base_id))
        self.conn.commit()

    def insertDataPoint(self, sensor_obj):
        self.c.execute("INSERT INTO raw_data (value, year, month, day, hour, createdAt, updatedAt, sensor_id, group_id, basestation_id) VALUES(%f, %d, %d, %d, %d, '%s', %s, %d, %d, %d);"%(sensor_obj.value, sensor_obj.year, sensor_obj.month, sensor_obj.day, sensor_obj.hour, str(sensor_obj.time_str), 'NOW()', sensor_obj.sensor_id,sensor_obj.group_id, sensor_obj.base_id))
        self.conn.commit()
        return 0

    def insertUser(self, f_name, l_name, email, u_name, phonenumber, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt(10)).decode('utf-8')
        self.c.execute("INSERT INTO users (username, password, first_name, last_name, email, phone, createdAt, updatedAt) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', NOW(), NOW())"%(u_name, hashed_password, f_name, l_name, email, phonenumber))
        self.conn.commit()
        return 0

    def deleteDataPoint(self,sensor_obj):
        self.conn.commit()
        return 0
    
    def deleteDataId(self, id_value):
        self.conn.commit()
        return 0
    
    def deleteBasestation(self, name):
        self.c.execute('DELETE FROM basestations WHERE name = "%s";'%(str(name)))
        self.conn.commit()

    def deleteSensor(self, sensor_id):
        self.c.execute('DELETE FROM sensors WHERE id = %d;'%(sensor_id))
        self.conn.commit()
   
    def deleteUser(self,user_id):
        self.c.execute('DELETE FROM users WHERE id = %d;'%(user_id))
        self.conn.commit()

    def listBasestations(self):
        self.c.execute("SELECT * from basestations;")
        results = self.c.fetchall()
        for base in results:
            print("id: %d name %s description %s"%(base[0],base[1],base[2]))
    
    def listSensors(self):
        self.c.execute("SELECT * from sensors;")
        results = self.c.fetchall()
        for sensor in results:
            print(sensor)

    def listUsers(self):
        self.c.execute("SELECT * from users;")
        users = self.c.fetchall()
        for user in users:
            print("id: %d name %s %s username: %s email %s phone %s"%(user[0],user[3],user[4], user[1], user[5],user[6]))

    def getUsers(self):
        self.c.execute("SELECT * from users;")
        users = self.c.fetchall()
        return users
   
    def getSensor(self, sensor_id):
        self.c.execute("SELECT * from sensors WHERE id=%d;"%(sensor_id))
        sensor = self.c.fetchone()
        return sensor

    def setThreshold(self, sensor_id, threshold):
        self.c.execute("UPDATE sensors SET threshold=%d WHERE id=%d;"%(threshold, sensor_id))
        self.conn.commit()
    
    def updateName(self, sensor_id, name):
        self.c.execute("UPDATE sensors SET name='%s' WHERE id=%d;"%(name, sensor_id))
        self.conn.commit()

if __name__ == "__main__":
    test = DBData("localhost", 3306, "admin", "stemyleafy")
    test.listBasestations()
    test.listSensors()
    test.listUsers()
