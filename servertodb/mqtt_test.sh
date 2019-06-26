#! /bin/sh
#
# mqtt_test.sh
# Copyright (C) 2019 root <root@harvestmeasurement>
#
# Distributed under terms of the MIT license.
#
json_value="{\"base_id\": 1, \"type\": \"carbon_dioxide\", \"value\": 2000, \"time\": 1561435274.941243, \"sensor_id\": 595546829, \"group_id\": 1}"
mosquitto_pub -h 0.0.0.0 -p 1883 -t 'sensors/237f52cd' -m "$json_value" -q 1

