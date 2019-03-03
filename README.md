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

## DB info
Updatingthe raw db should automatically trigger the other dbs to update based upon the values


