module.exports = function(sequelize, Sequelize) {
    var MonthlyData = sequelize.define('monthly_data', {
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