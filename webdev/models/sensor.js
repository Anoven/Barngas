module.exports = function(sequelize, Sequelize) {
    var Sensor = sequelize.define('sensor', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Sensor;
}
