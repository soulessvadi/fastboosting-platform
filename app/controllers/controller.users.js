const Schemas = require('../models/schemas');
const connection = require('../models/sequelize');
const utils = require('../utils/helpers');

module.exports = (db) => {

	const UsersController = {};

	UsersController.list = (req, res, next) => {
		connection.query("select * from users", { model: Schemas.User })
		.then((results) => {
	    	res.status(200).json({ 'users': results });
		})
		.catch((err) => {
			res.status(500).json('internal error');
		});
	};

	UsersController.user = (req, res, next) => {
		connection.executeOne("select * from users where id = ? limit 1", { replacements: [req.params.id], model: Schemas.User })
		.then((results) => {
			if(results) res.status(200).json(results);
			else res.status(404).json('user not found');
		})
		.catch((err) => {
			res.status(500).json('internal error');
		});
	};

	UsersController.create = (req, res, next) => {
		if(!utils.isEmail(req.body.email) ||
			req.body.login.length < 5 ||
			req.body.password.length < 8) {
			res.status(202).json('bad parameters');
		}

		Schemas.User.findOrCreate({
			where: {
				login: req.body.login
			}, 
			defaults: {
				email: req.body.email, 
				password: req.body.password, 
				is_subscribed: req.body.subscribe
			}
		})
		.spread((user, created) => {
		    if(created) 
		    	res.status(201).json(user);
		    else 
		    	res.status(200).json(`user ${req.body.login} already exists`);
	    })
		.catch(err => {
			res.status(500).json('internal error');
		});
	};

	UsersController.update = (req, res, next) => {
		Schemas.User.findById(req.params.id)
		.then((user) => {
			user.update({
				login: req.body.login, 
				password: req.body.password, 
				first_name: req.body.first_name, 
				last_name: req.body.last_name, 
				nick_name: req.body.nick_name 
			})
			.then(() => {
	    		res.status(200).json(user);
			})
			.catch((err) => {
				res.status(500).json('internal error');
			})
		})
		.catch((err) => {
	    	res.status(404).json('user not found');
		});
	};

	UsersController.remove = (req, res, next) => {
		Schemas.User.findById(req.params.id)
		.then((user) => {
			user.destroy();
    		res.status(200).json(user);
		})
		.catch((err) => {
	    	res.status(404).json('user not found');
		});
	    res.status(200).json({'users': [{'name':'savage'}]});
	};

	return UsersController;

};