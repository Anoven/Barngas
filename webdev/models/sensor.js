module.exports = function(sequelize, Sequelize) {
    var Sensor = sequelize.define('sensor', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Sensor;
}