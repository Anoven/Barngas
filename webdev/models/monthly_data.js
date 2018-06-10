module.exports = function(sequelize, Sequelize) {
    var MonthlyData = sequelize.define('monthlyData', {
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
        }
    });
    return MonthlyData;
}