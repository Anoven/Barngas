#!/bin/sh

echo "updating firmware!"
killall -9 python3
cd /home/pi/Barngas/
git pull origin
/home/pi/Barngas/basetoserver/scripts/start.sh

