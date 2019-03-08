# WEBDEV STUFF

To do any web stuff, `cd webdev` first

## Dependencies
using node, npm, typescript, mysql

## Setup
First install the dependencies:
`npm install`

To start up the server:
`npm start`

The database should automatically be synced - but the contents of the db will probably be different (if you aren't running on the server) - might not run if you do not have mysql installed 

## Seting up the DB:

to purge the db, run:
`python3 droptables.py`

To recreate the db, start up the server.
To get the seeded data, run 
`python3 seedDb.py`

## DB Info
Updatingthe raw db should automatically trigger the other dbs to update based upon the values

#Server To DB

There is a mqtt broker which runs in the background, and the mqttclient handles the data to read

## MQTT install

sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
sudo apt-get update
sudo apt-get install mosquitto
sudo apt-get install mosquitto-clients
sudo pip3 install paho-mqtt
service start mosquitto 

## MQTT client

The mqtt client has all the callback functiosnf or the nodes we designed already.
Read the comments in the code
mqtt_tes.sh can be used to test the mqttclient.py


