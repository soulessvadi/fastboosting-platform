const Schemas = require('./schemas');
const connection = require('./sequelize');
const utils = require('../utils/helpers');
let provider = {};

provider.getHeroes = function() {
	return Schemas.Hero.findAll({ attributes: ['id', 'localized_name'], order: ['localized_name'], raw: true });
};

provider.getLanes = function() {
	return Schemas.Lane.findAll({ attributes: ['id', 'name'], order: ['id'], raw: true });
};

provider.getCountries = function() {
	return Schemas.Country.findAll({ attributes: ['id', 'name', 'alpha2'], order: ['name'], raw: true });
};

provider.payMethods = function() {
	return Schemas.PayMethod.findAll({ attributes: ['id', 'name'], order: ['id'], raw: true });
};

provider.getServers = function() {
	return Schemas.OrderServer.findAll({ attributes: ['id', 'name'], order: ['id'], raw: true });
};

module.exports = provider;