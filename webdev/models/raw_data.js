module.exports = function(sequelize, Sequelize) {
    var RawData = sequelize.define('raw_data', {
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
        },
        hour: {
            type: Sequelize.INTEGER
        }

    });
    return RawData;
}