module.exports = function(sequelize, Sequelize) {
    var Note = sequelize.define('note', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        text: {
            type: Sequelize.STRING
        }

    });
    return Note;
}