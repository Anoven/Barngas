module.exports = function(sequelize, Sequelize) {
    var SensorGroup = sequelize.define('sensorGroup', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }
    });
    return SensorGroup;
}