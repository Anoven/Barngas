import pymysql
import pymysql.cursors
import os


conn = pymysql.connect(host="localhost", port = 3306, user = "root",passwd = "harv3str0b0tics", db = "barngas")
c = conn.cursor()

c.execute('DELETE FROM users WHERE username = "tester" AND first_name = "tester" AND last_name = "tester"')
c.execute('INSERT INTO users VALUES(1, "tester", "tester", "tester", "tester", "tester", "tester", NOW(), NOW())')

c.execute('DELETE FROM basestations WHERE name = "test1";')
c.execute('DELETE FROM basestations WHERE name = "test2";')
c.execute('INSERT INTO basestations VALUES(1, "test1", "testing station", NOW(), NOW(), 1);')
c.execute('INSERT INTO basestations VALUES(2, "test2", "testing station", NOW(), NOW(), 1);')

c.execute('DELETE FROM groups WHERE name = "test_group_1";')
c.execute('DELETE FROM groups WHERE name = "test_group_2";')
c.execute('INSERT INTO groups VALUES(1, "test_group_1", "testing group", NOW(), NOW(), 1);')
c.execute('INSERT INTO groups VALUES(2, "test_group_2", "testing group", NOW(), NOW(), 2);')


c.execute('DELETE FROM sensors WHERE name = "methane_test_1";')
c.execute('DELETE FROM sensors WHERE name = "methane_test_2";')
c.execute('DELETE FROM sensors WHERE name = "temp_test_1";')
c.execute('INSERT INTO sensors VALUES(1, "METHANE", "methane_test_1", "methane testing", NOW(), NOW(), 1, 1);')
c.execute('INSERT INTO sensors VALUES(2, "TEMPERATURE", "methane_test_2", "methane testing", NOW(), NOW(), 1, 1);')
c.execute('INSERT INTO sensors VALUES(3, "METHANE", "temp_test_1", "temperature testing", NOW(), NOW(), 2, 2);')

c.execute('TRUNCATE TABLE raw_data;')
for i in range(1, 1001):
	val = float(i)/float(1000) * 100
	val2 = float(1000- i)/float(1000) * 100
	datetime = 'NOW() + INTERVAL %d HOUR'%(i)
	c.execute('INSERT INTO raw_data VALUES(%d, %f, YEAR(%s), MONTH(%s), DAY(%s), HOUR(%s), %s, %s, 1, 1, 1);'%(i, val, datetime, datetime, datetime, datetime, datetime, datetime))
	c.execute('INSERT INTO raw_data VALUES(%d, %f, YEAR(%s), MONTH(%s), DAY(%s), HOUR(%s), %s, %s, 2, 1, 1);'%(1000 + i, val, datetime, datetime, datetime, datetime, datetime, datetime))

conn.commit()
conn.close()
