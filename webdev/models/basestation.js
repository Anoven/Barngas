module.exports = function(sequelize, Sequelize) {
    var BaseStation = sequelize.define('basestation', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }
    });
    return BaseStation;
}