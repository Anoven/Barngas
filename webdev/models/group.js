module.exports = function(sequelize, Sequelize) {
    var Group = sequelize.define('group', {
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
        },
        archived: {
            type: Sequelize.BOOLEAN
        }
    });
    return Group;
}