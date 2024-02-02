const Datatypes = require('sequelize');
require('dotenv').config();

const connection = new Datatypes( process.env.DB_SCHEMA, process.env.DB_USER , process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    port: process.env.DB_PORT
});

const db = {};

db.DataTypes = Datatypes;
db.sequelize = connection;

db.User = require('./User.model')(connection, Datatypes)
db.Note = require('./Notes.model')(connection, Datatypes )
db.User.sync()
db.Note.sync()

module.exports = db;