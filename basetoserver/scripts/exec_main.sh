#! /bin/sh
#
# exec_main.sh
# Copyright (C) 2019 root <root@harvestmeasurement>
#
# Distributed under terms of the MIT license.
#
BASESTATION=/home/pi/Barngas/basetoserver
cd $BASESTATION
while true; do python3 main.py; sleep 5; done
