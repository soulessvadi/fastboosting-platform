const Sequelize = require('sequelize');

const connection = new Sequelize('fbplatform', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

connection.authenticate().catch(err => {
  console.error('Unable to connect to the database.', err);
});

exports.connection = connection;
exports.Sequelize = Sequelize;