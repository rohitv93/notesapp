module.exports = (sequelize, DataTypes) => {
    const note = sequelize.define('Note', {
        userId: {
            type: DataTypes.INTEGER,
            allownull: false,
        },
        title: {
            type: DataTypes.STRING,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        }
    });
    return note;
}

