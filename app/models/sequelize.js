const Sequelize = require('sequelize');

const connection = new Sequelize('fbplatform', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false /*console.log*/,
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

exports.Sequelize = Sequelize;

exports.connection = connection;

exports.execute = (query, options) => {
  return new Promise((resolve, reject) => {
    connection.query(query, options)
    .then((results, meta) => {
      resolve(results)
    })
    .catch((err) => {
      reject(err);
    });
  }); 
};

exports.executeOne = (query, options) => {
  return new Promise((resolve, reject) => {
    connection.query(query, options)
    .then((results, meta) => {
      resolve(results ? results[0] : results)
    })
    .catch((err) => {
      reject(err);
    });
  }); 
};