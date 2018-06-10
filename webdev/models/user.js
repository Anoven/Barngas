module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        email: {
            type: Sequelize.STRING,
            allowNull: false
            // validate: {
            //     isEmail: true
            // }
        },
        phone: {
            type: Sequelize.STRING
        }
    });
    return User;
}