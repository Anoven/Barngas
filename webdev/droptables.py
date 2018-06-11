import pymysql
import pymysql.cursors
import os


conn = pymysql.connect(host="localhost", port = 3306, user = "root",passwd = "harv3str0b0tics", db = "barngas")
c = conn.cursor()

c.execute('''SET FOREIGN_KEY_CHECKS = 0;
			drop table basestations;
			drop table dailyData;
			drop table hourlyData;
			drop table monthlyData;
			drop table rawData;
			drop table sensorGroups;
			drop table sensors;
			drop table users;
			drop table yearlyData;
			SET FOREIGN_KEY_CHECKS = 0;
			drop triggers;
			''')

conn.close()
