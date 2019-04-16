#! /bin/sh
#
# mqtt_test.sh
# Copyright (C) 2019 root <root@harvestmeasurement>
#
#
test_server_to_base()
{
	json_value_1="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"cmd\": \"test\"}"
	mosquitto_pub -h 0.0.0.0 -p 1883 -t 'basestation/1/sensorcmd' -m "$json_value_1" -q 2
	json_value_2="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"cmd\": \"test\"}"
	mosquitto_pub -h 0.0.0.0 -p 1883 -t 'basestation/1/basecmd' -m "$json_value_2" -q 2
	json_value_3="{\"sensor_id\": 1,\"group_id\": 1,\"base_id\": 1,\"cmd\": \"interval 5\"}"
	mosquitto_pub -h 0.0.0.0 -p 1883 -t 'basestation/1/sensorcmd' -m "$json_value_3" -q 2
}

test_base_to_server()
{
	json_value_1="{\"sensor_id\": 1, \"group_id\": 1, \"base_id\": 1, \"type\": \"methane\", \"value\": 10, \"time\": 1555389572}"
#	mosquitto_pub -h 0.0.0.0 -p 1883 -t 'sensor/1' -m "$json_value_1" -q 2
	echo $json_value_1
}

usage()
{
	echo "mqtt_test.sh <command>"
	echo " 				command: b2s, s2b, help"
}

case "$1" in
	help)
		usage
		;;
	b2s)
		test_base_to_server
		;;
	s2b)
		test_server_to_base
		;;
	*)
		usage
		;;
esac
