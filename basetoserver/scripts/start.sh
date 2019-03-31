#!/bin/sh
pon rogers&
sleep 5
rc=1
count=100                            # Maximum number to try.
while [ $count -ge 0 ]
do
    ping -c 1 138.197.156.151                      # Try once.
    rc=$?
    echo "rc $rc count $count">>/home/pi/test.txt
    if [ $rc -eq 0 ]
    then
	BASESTATIONFOLDER=/home/pi/Barngas/basetoserver/
	cd $BASESTATIONFOLDER
	python3 main.py&
	echo "started!" >> /home/pi/test.txt
	exit 0
   fi
   count=$(($count-1))
   sleep 2
done
echo $rc>>/home/pi/test.txt
echo "couldn't connect to server! ">>/home/pi/test.txt

exit 1

