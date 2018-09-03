const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const utils = require('../utils/helpers');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const async = require('async');
const storage = require('../utils/storage');
const randstr = require('randomstring');

module.exports = (db) => {
	const controller = {};

	controller.register = (req, res, next) => {
		if(!utils.isEmail(req.body.login)) {
			return res.status(202).json({'error':'invalid_login'});
		}
		if(req.body.password.length < 8) {
			return res.status(202).json({'error':'invalid_password'});
		}

		let order_permissions;
		(async () => {
			try {
 				order_permissions = Models.UserType.findOne({where:{id:3},attributes:['order_permissions']});
			} catch(e) {
				order_permissions = '';
			}
		})();

		Models.User.findOrCreate({
			where: { login: req.body.login }, 
			defaults: {
				type: 3,
				email: req.body.login, 
				nick_name: req.body.nick_name, 
				password: req.body.password, 
				is_subscribed: req.body.subscribe,
				order_permissions: order_permissions,
			}
		})
		.spread((user, created) => {
		    if(created) {
		    	Models.Log.create({user_id: user.id, action_id: 1});
		    	res.status(200).json({'error': null});
		    } else {
		    	res.status(202).json({'error': `user_exists`});
		    } 
	    })
		.catch(err => {
			res.status(202).json({'error':'internal_error'});
		});
	};

	controller.recovery = (req, res, next) => {
		let SearchUser;
		if(req.body.email.length) {
			if(!utils.isEmail(req.body.email) && !req.body.username.length) 
				return res.status(202).json({'error':'invalid_email'});
			SearchUser = Models.User.findOne({ where: { login: req.body.login }});
		} else if(req.body.username.length < 5) {
			return res.status(202).json({'error':'invalid_username'});
		} else {
			SearchUser = Models.User.findOne({ where: { nick_name: req.body.username }});
		}

		SearchUser.then((user) => {
		    if(user) {
		    	let recovery_hash = randstr.generate(24);
		    	user.update({recovery_hash: recovery_hash});
		    	Models.Log.create({user_id: user.id, action_id: 17});
		    	// send email with link to /auth/recovery/recovery_hash
		    	res.status(200).json({'error': null});
		    } else {
		    	res.status(202).json({'error': `user_absent`});
		    } 
	    }).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});
	};

	controller.authorize = (req, res, next) => {
		if(req.body.login.length < 5 || req.body.password.length < 8) {
			res.status(202).json({'error':'bad parameters'});
		}
		connection.executeOne(`
			select u.id,u.type,u.permissions,u.order_permissions,u.lanes,u.heroes,u.first_name,u.last_name,u.nick_name,u.language, 
			u.is_approved,u.is_blocked,u.is_subscribed,u.language,u.avatar,u.country,u.phone,u.skype,u.discord,u.email,u.created_at,
			u.facebook,u.vkontakte,u.twitter,u.youtube,u.instagram,u.mmr_solo,u.mmr_party,u.dotabuff,u.is_configured,u.rating,
			if((select id from orders o where o.worker_id = u.id and (o.status = 6 or o.status = 9) limit 1), true, false) as is_busy,
			(select o.system_number from orders o where o.worker_id = u.id and (o.status = 6 or o.status = 9) limit 1) as active_order
			from users as u
			where u.login = ? and u.password = ? limit 1`, { replacements: [req.body.login, md5(req.body.password)], raw: true})
		.then((user) => {
			if(user) {
				if(user.is_blocked) {
					res.status(202).json({'error':'user_blocked'});
				} else if(!user.is_approved) {
					res.status(202).json({'error':'user_not_approved'});
				} else {
					if(!fs.existsSync(storage.spaces.avatars + user.avatar)) {
						user.avatar = 'mock.png';
					}
	    			Models.Log.create({user_id: user.id, action_id: 2});
					let token = utils.jwtSign(user, req.body.rememberMe);
					res.status(200).json({'_token': token, user: {
						id: user.id,
						first_name: user.first_name,
						last_name: user.last_name,
						nick_name: user.nick_name,
						avatar: user.avatar,
						is_configured: user.is_configured,
						is_busy: user.is_busy,
						active_order: user.active_order,
						rating: user.rating,
					}});
				}
			} else {
				res.status(202).json({'error':'not_authorized'});
			}
		})
		.catch((err) => {
			res.status(202).json({'error':'internal_error'});
		});
	};

	return controller;

};