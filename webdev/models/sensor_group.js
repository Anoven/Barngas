module.exports = function(sequelize, Sequelize) {
    var SensorGroup = sequelize.define('sensorGroup', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
        	type: Sequelize.STRING
        },
        description: {
        	type: Sequelize.STRING
        }
    });
    return SensorGroup;
}