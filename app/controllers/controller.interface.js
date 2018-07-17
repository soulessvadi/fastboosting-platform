const Schemas = require('../models/schemas');
const connection = require('../models/sequelize');

module.exports = (db) => {

	const InterfaceController = {};

	InterfaceController.get = (req, res, next) => {
		res.json('interface');
	};

	return InterfaceController;

};