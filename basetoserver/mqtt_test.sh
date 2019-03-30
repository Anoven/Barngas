#! /bin/sh
#
# mqtt_test.sh
# Copyright (C) 2019 root <root@harvestmeasurement>
#
# Distributed under terms of the MIT license.
#
json_value_1="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"cmd\": \"test\"}"
mosquitto_pub -h 0.0.0.0 -p 1883 -t 'basestation/1/sensorcmd' -m "$json_value_1" -q 2
json_value_2="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"cmd\": \"update\"}"
mosquitto_pub -h 0.0.0.0 -p 1883 -t 'basestation/1/basecmd' -m "$json_value_2" -q 2
json_value_3="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"cmd\": \"interval 5\"}"
mosquitto_pub -h 0.0.0.0 -p 1883 -t 'basestation/1/sensorcmd' -m "$json_value_3" -q 2
