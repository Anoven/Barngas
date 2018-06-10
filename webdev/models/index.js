"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
let sequelize = new Sequelize('barngas', 'root', 'harv3str0b0tics', {
    dialect: 'mysql',
    host: 'localhost'
});
var db = {};
 
 
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

// set up foreign key constraints
//basestation
db['user'].hasOne(db['basestation']);   //each basestation has a user

//group
db['basestation'].hasOne(db['sensorGroup']);  // each group has a basestation

//sensor
db['sensorGroup'].hasOne(db['sensor']);       // each sensor has a group
db['basestation'].hasOne(db['sensor']);       // each sensor has a basestation - this is probably not going to be used

//data tables - each data entry is associated with a sensor, a basestation, and a group
db['sensor'].hasOne(db['rawData']);
db['sensorGroup'].hasOne(db['rawData']);
db['basestation'].hasOne(db['rawData']);

db['sensor'].hasOne(db['hourlyData']);
db['sensorGroup'].hasOne(db['hourlyData']);
db['basestation'].hasOne(db['hourlyData']);

db['sensor'].hasOne(db['dailyData']);
db['sensorGroup'].hasOne(db['dailyData']);
db['basestation'].hasOne(db['dailyData']);

db['sensor'].hasOne(db['monthlyData']);
db['sensorGroup'].hasOne(db['monthlyData']);
db['basestation'].hasOne(db['monthlyData']);

db['sensor'].hasOne(db['yearlyData']);
db['sensorGroup'].hasOne(db['yearlyData']);
db['basestation'].hasOne(db['yearlyData']);

console.log(db);
db.sequelize = sequelize;
 
module.exports = db;