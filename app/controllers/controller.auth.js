const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const utils = require('../utils/helpers');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const async = require('async');
const storage = require('../utils/storage');
const randstr = require('randomstring');
const Mailer = require('../utils/mailer');

module.exports = (db) => {
	const controller = {};

	controller.userVerify = (req, res, next) => {
		let recovery_hash = req.params.hash || null;
		if(!recovery_hash) {
			res.status(202).json({'error':'bad_parameters'})
		} else {
			Models.User.findOne({where:{recovery_hash:recovery_hash}, attributes:['id', 'email', 'first_name', 'last_name', 'nick_name', 'is_blocked', 'avatar']})
			.then((user) => {
				if(!user) return res.status(202).json({'error':'user_not_found'});
				if(!fs.existsSync(storage.spaces.avatars + user.avatar)) user.avatar = 'mock.png';
				user.update({is_approved: true});
				res.status(200).json({'user':user.dataValues});
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}
	};

	controller.userLocked = (req, res, next) => {
		let user_id = parseInt(req.params.id || 0);
		async.parallel({
			user: (cb) => {
				if(!req.params.id) {
					cb(null, null);
				} else {
					connection.executeOne(
						`select id, email, first_name, last_name, nick_name, is_blocked, avatar 
						from users where id = ${user_id} and is_blocked = 1 limit 1`, { raw: true })
					.then((user) => {
						if(!fs.existsSync(storage.spaces.avatars + user.avatar)) user.avatar = 'mock.png';
						cb(null, user);
					}).catch((err) => res.status(202).json({'error':'internal_error'}));
				}
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.register = (req, res, next) => {
		if(!utils.isEmail(req.body.login)) {
			return res.status(202).json({'error':'invalid_login'});
		}
		if(req.body.password.length < 8) {
			return res.status(202).json({'error':'invalid_password'});
		}
		let defaultType = 3;
		let userType;
		(async () => {
			try {
 				userType = await Models.UserType.findOne({where:{id:defaultType},attributes:['permissions','order_permissions']});
			} catch(e) {
				userType.permissions = null;
				userType.order_permissions = null;
			}
			Models.User.findOrCreate({
				where: { login: req.body.login }, 
				defaults: {
					type: defaultType,
					email: req.body.login, 
					nick_name: req.body.nick_name, 
					password: md5(req.body.password), 
					is_subscribed: req.body.subscribe || 1,
					referred_by: req.body.referred_by || null,
					order_permissions: userType.order_permissions,
					permissions: userType.permissions,
				}
			}).spread((user, created) => {
			    if(created) {
			    	Models.Log.create({user_id: user.id, action_id: 1});
			    	res.status(200).json({'error': null});
					new Mailer(`<a taget="_blank" href="http://vda.daricvety.com.ua/boosters/auth/verify/${user.recovery_hash}">Activation Link</a>`)
					.transform({title: 'my title'})
					.send(user.login, '✔ You were registered','✔ You were registered');
			    } else {
			    	res.status(202).json({'error': `user_exists`});
			    } 
		    }).catch(err => {
				res.status(202).json({'error':'internal_error'});
			});
		})();

	};

	controller.recovery = (req, res, next) => {
		let SearchUser;
		if(req.body.email.length) {
			if(!utils.isEmail(req.body.email) && !req.body.username.length) return res.status(202).json({'error':'invalid_email'});
			SearchUser = Models.User.findOne({ where: { login: req.body.email }});
		} else if(req.body.username.length < 5) {
			return res.status(202).json({'error':'invalid_username'});
		} else {
			SearchUser = Models.User.findOne({ where: { nick_name: req.body.username }});
		}

		SearchUser.then((user) => {
		    if(user) {
		    	Models.Log.create({user_id: user.id, action_id: 17});
				new Mailer(`<a taget="_blank" href="http://vda.daricvety.com.ua/boosters/auth/recovery/${user.recovery_hash}">Recovery Link</a>`)
				.transform({title: 'my title'})
				.send(user.login, '✔ Password Recovery','✔ Password Recovery');
		    	res.status(200).json({'error': null});
		    } else {
		    	res.status(202).json({'error': `user_absent`});
		    } 
	    }).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});
	};

	controller.recoveryPassword = (req, res, next) => {
		let recovery_hash = req.params.hash || null;
		if(!recovery_hash || !req.body.password || req.body.password.length < 8) {
			res.status(202).json({'error':'bad_parameters'})
		} else {
			Models.User.findOne({where:{recovery_hash:recovery_hash}})
			.then((user) => {
				if(!user) return res.status(202).json({'error':'user_not_found'});
		    	user.update({
		    		recovery_hash: String(randstr.generate(4) + Math.floor(Date.now()/1000)).hexval(false),
		    		password: md5(req.body.password),
		    	});
				new Mailer(`<a taget="_blank" href="http://vda.daricvety.com.ua/boosters/auth/login">Password has been changed</a>`)
				.transform({title: 'my title'})
				.send(user.login, '✔ Password Recovery','✔ Password Recovery');
				res.status(200).json({'status':'ok'});
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}
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
					res.status(202).json({'error':'user_blocked', 'id': user.id});
				} else if(!user.is_approved) {
					res.status(202).json({'error':'user_not_approved'});
				} else {
					if(!fs.existsSync(storage.spaces.avatars + user.avatar)) user.avatar = 'mock.png';
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