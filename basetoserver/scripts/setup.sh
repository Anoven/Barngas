#!/bin/sh
CHROMESETUPFILE="/home/pi/.config/lxsession/LXDE-pi/autostart"
CHROMESETUPCOMMAND="@/usr/bin/chromium-browser --kiosk --disable-restore-session-state http://138.197.156.151:3000/login"

#sets up the autostart to chrome harvest measurement
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
