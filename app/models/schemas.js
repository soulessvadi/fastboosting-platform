const connection = require('./sequelize').connection;
const Sequelize = require('./sequelize').Sequelize;

let UserType = connection.define('users_type', {
  name: {type: Sequelize.STRING(64), defaultValue: ''},
  privileges: {type: Sequelize.TEXT, defaultValue: ''},
}, {
  underscored: true
});

let User = connection.define('user', {
  type: {type: Sequelize.INTEGER, defaultValue: 1},
  privileges: {type: Sequelize.TEXT, defaultValue: ''},
  login: {type: Sequelize.STRING(64), defaultValue: '', unique: true},
  password: {type: Sequelize.STRING(64), defaultValue: ''},
  first_name: {type: Sequelize.STRING(64), defaultValue: ''},
  last_name: {type: Sequelize.STRING(64), defaultValue: ''},
  nick_name: {type: Sequelize.STRING(64), defaultValue: ''},
  birth_date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  language: {type: Sequelize.STRING(64), defaultValue: ''},
  country: {type: Sequelize.INTEGER, defaultValue: 0},
  city: {type: Sequelize.INTEGER, defaultValue: 0},
  zip: {type: Sequelize.INTEGER, defaultValue: 0},
  phone: {type: Sequelize.STRING(64), defaultValue: ''},
  skype: {type: Sequelize.STRING(64), defaultValue: ''},
  discord: {type: Sequelize.STRING(64), defaultValue: ''},
  is_approved: {type: Sequelize.BOOLEAN, defaultValue: false},
  is_blocked: {type: Sequelize.BOOLEAN, defaultValue: false},
  is_subscribed: {type: Sequelize.BOOLEAN, defaultValue: false},
  ip_address: {type: Sequelize.STRING(64), defaultValue: ''},
}, {
  underscored: true
});

let Order = connection.define('order', {
  client_id: {type: Sequelize.INTEGER, defaultValue:0},
  booster_id: {type: Sequelize.INTEGER, defaultValue:0},
  type: {type: Sequelize.INTEGER, defaultValue:0},
  status: {type: Sequelize.INTEGER, defaultValue:0},
  amount: {type: Sequelize.DOUBLE, defaultValue:0.00},
}, {
  underscored: true
});

module.exports = { UserType, User, Order };