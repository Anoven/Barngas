module.exports = function(sequelize, Sequelize) {
    var DailyData = sequelize.define('daily_data', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        value: {
            type: Sequelize.FLOAT
        },
        year: {
            type: Sequelize.INTEGER
        },
        month: {
            type: Sequelize.INTEGER
        },
        day: {
            type: Sequelize.INTEGER
        }
    });
    return DailyData;
}