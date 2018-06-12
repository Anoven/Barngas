module.exports = function(sequelize, Sequelize) {
    var YearlyData = sequelize.define('yearly_data', {
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
        }
    });
    return YearlyData;
}