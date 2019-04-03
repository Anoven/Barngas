#!/bin/sh

echo "updating firmware!"
killall -9 python3
sshpass -p "serverpassword"scp -r root@138.197.156.151:/root/Base_release/Barngas /home/pi/
/home/pi/Barngas/basetoserver/scripts/start.sh
