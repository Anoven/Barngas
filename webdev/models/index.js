"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
let sequelize = new Sequelize('barngas', 'admin', 'stemyleafy', {
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
db['user'].hasMany(db['basestation'], {foreignKey: 'user_id'});   //each basestation has a user\
db['basestation'].belongsTo(db['user'], {foreignKey: 'user_id'})

//group
db['basestation'].hasMany(db['group'], {foreignKey: 'basestation_id'});  // each group has a basestation
db['group'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

//sensor
db['group'].hasMany(db['sensor'], {foreignKey: 'group_id'});       // each sensor has a group
db['sensor'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['sensor'], {foreignKey: 'basestation_id'});       // each sensor has a basestation 
db['sensor'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

//data tables - each data entry is associated with a sensor, a basestation, and a group
db['sensor'].hasMany(db['raw_data'], {foreignKey: 'sensor_id'});
db['raw_data'].belongsTo(db['sensor'], {foreignKey: 'sensor_id'});

db['group'].hasMany(db['raw_data'], {foreignKey: 'group_id'});
db['raw_data'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['raw_data'], {foreignKey: 'basestation_id'});
db['raw_data'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

// Hourly _data
db['sensor'].hasMany(db['hourly_data'], {foreignKey: 'sensor_id'});
db['hourly_data'].belongsTo(db['sensor'], {foreignKey: 'sensor_id'});

db['group'].hasMany(db['hourly_data'], {foreignKey: 'group_id'});
db['hourly_data'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['hourly_data'], {foreignKey: 'basestation_id'});
db['hourly_data'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

// Daily _data
db['sensor'].hasMany(db['daily_data'], {foreignKey: 'sensor_id'});
db['daily_data'].belongsTo(db['sensor'], {foreignKey: 'sensor_id'});

db['group'].hasMany(db['daily_data'], {foreignKey: 'group_id'});
db['daily_data'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['daily_data'], {foreignKey: 'basestation_id'});
db['daily_data'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

// Monthly _data
db['sensor'].hasMany(db['monthly_data'], {foreignKey: 'sensor_id'});
db['monthly_data'].belongsTo(db['sensor'], {foreignKey: 'sensor_id'});

db['group'].hasMany(db['monthly_data'], {foreignKey: 'group_id'});
db['monthly_data'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['monthly_data'], {foreignKey: 'basestation_id'});
db['monthly_data'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

//Yearly _data
db['sensor'].hasMany(db['yearly_data'], {foreignKey: 'sensor_id'});
db['yearly_data'].belongsTo(db['sensor'], {foreignKey: 'sensor_id'});

db['group'].hasMany(db['yearly_data'], {foreignKey: 'group_id'});
db['yearly_data'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['yearly_data'], {foreignKey: 'basestation_id'});
db['yearly_data'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

//data tables - each data entry is associated with a sensor, a basestation, and a group
db['sensor'].hasMany(db['note'], {foreignKey: 'sensor_id'});
db['note'].belongsTo(db['sensor'], {foreignKey: 'sensor_id'});

db['group'].hasMany(db['note'], {foreignKey: 'group_id'});
db['note'].belongsTo(db['group'], {foreignKey: 'group_id'});

db['basestation'].hasMany(db['note'], {foreignKey: 'basestation_id'});
db['note'].belongsTo(db['basestation'], {foreignKey: 'basestation_id'});

console.log(db);
db.sequelize = sequelize;
 
module.exports = db;
