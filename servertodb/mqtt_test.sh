#! /bin/sh
#
# mqtt_test.sh
# Copyright (C) 2019 root <root@harvestmeasurement>
#
# Distributed under terms of the MIT license.
#
json_value="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"value\": 1,\"time\": 1551932889, \"type\": \"methane\"}"
mosquitto_pub -h 0.0.0.0 -p 1883 -t 'sensors/1' -m "$json_value" -q 1

