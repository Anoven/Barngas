import pymysql
import pymysql.cursors
import os


conn = pymysql.connect(host="localhost", port = 3306, user = "root",passwd = "harv3str0b0tics", db = "barngas")
c = conn.cursor()

c.execute('''SET FOREIGN_KEY_CHECKS = 0;
			drop table basestations;
			drop table daily_data;
			drop table hourly_data;
			drop table monthly_data;
			drop table raw_data;
			drop table groups;
			drop table sensors;
			drop table users;
			drop table yearly_data;
			SET FOREIGN_KEY_CHECKS = 0;
			drop triggers;
			''')

conn.close()
