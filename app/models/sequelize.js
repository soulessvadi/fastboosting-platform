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

exports.Sequelize = Sequelize;

exports.connection = connection;

exports.upsert = function (model, values, condition) {
    return model
    .findOne({ where: condition })
    .then(function(obj) {
      if(obj) 
        return obj.update(values);
      else
        return model.create(values);
    });
};

exports.execute = (query, options) => {
  if(!options.hasOwnProperty('type')) options.type = Sequelize.QueryTypes.SELECT; 
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
  if(!options.hasOwnProperty('type')) options.type = Sequelize.QueryTypes.SELECT;
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