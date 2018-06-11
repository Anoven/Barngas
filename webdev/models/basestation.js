module.exports = function(sequelize, Sequelize) {
    var BaseStation = sequelize.define('basestation', {
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
    return BaseStation;
}