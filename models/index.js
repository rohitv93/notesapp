const Datatypes = require('sequelize');

const connection = new Datatypes('todos', 'admin' , 'Password4321', {
    host: 'testdb1.corayvn9jigk.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql',
    operatorsAliases: false,
});

const db = {};

db.DataTypes = Datatypes;
db.sequelize = connection;

db.User = require('./User.model')(connection, Datatypes)
db.Note = require('./Notes.model')(connection, Datatypes )
db.User.sync()
db.Note.sync()

module.exports = db;