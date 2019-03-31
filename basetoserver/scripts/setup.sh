#!/bin/sh
SETUP_MQTT=0
SETUP_CHROMIUM=0
SETUP_AUTOSTART=1

CHROMESETUPFILE="/home/pi/.config/lxsession/LXDE-pi/autostart"
CHROMESETUPCOMMAND="@/usr/bin/chromium-browser --kiosk --disable-restore-session-state http://138.197.156.151:3000/login"

HARVESTAUTOSTARTFILE="/etc/rc.local"

if [ $SETUP_CHROMIUM -eq 1 ]
then
	#sets up the autostart to chrome harvestmeasurement
	if [ -f $CHROMESETUPFILE ]
	then
		if [ $(grep -c "chromium" $CHROMESETUPFILE) -eq 0 ]
		then
			echo $CHROMESETUPCOMMAND >> $CHROMESETUPFILE
		else
			echo "chromium setup already!"
		fi
	else
		echo "setup file does not exsist!"
	fi
fi

if [ $SETUP_MQTT -eq 1 ]
then
	#set up mqtt libraries
	apt-get update
	apt-get install mosquitto
	apt-get install mosquitto-clients
	python3 -m pip install paho-mqtt
	service mosquitto start
fi

if [ $SETUP_AUTOSTART -eq 1 ]
then
	#set up autostart code
	if [ $(grep -c "start.sh" $HARVESTAUTOSTARTFILE) -eq 0 ]
	then
		echo "/home/pi/Barngas/basetoserver/scripts/start.sh" >> $HARVESTAUTOSTARTFILE
	else
		echo "autostart setup already!"
	fi
fi
