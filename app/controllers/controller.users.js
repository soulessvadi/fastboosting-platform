const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const storage = require('../utils/storage.js');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const randstr = require('randomstring');
var activity_date = moment().subtract(1, 'months').format('YYYY-MM-DD');

module.exports = (db) => {
	const newsController = require('./controller.news')(db);
	const controller = {};

	controller.typeDelete = (req, res, next) => {
		if(req.params.id) {
			Models.UserType.findById(req.params.id).then((type) => {
				type.destroy().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'group_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.typeCreate = (req, res, next) => {
		if(!req.body.name || 
			req.body.name.length < 2) {
			return res.status(202).json({'error':'bad_parameters'});
		}
		var mock = Models.UserType.build();
		mock.type = 3;
		mock.name = (req.body.name || mock.name);
		mock.permissions = (utils.jsonDecode(req.body.permissions) || {});
		mock.order_permissions = (utils.jsonDecode(req.body.order_permissions) || {});
		mock.save().then((type) => {
    		res.status(200).json({status:'ok',id:type.id});
		}).catch((err) => res.status(202).json({'error':'validation_error'}));
	};

	controller.typeUpdate = (req, res, next) => {
		if(req.params.id) {
			Models.UserType.findById(req.body.id).then((type) => {
				let data = { 
					permissions: (utils.jsonDecode(req.body.permissions) || type.permissions),
					order_permissions: (utils.jsonDecode(req.body.order_permissions) || type.order_permissions),
					name: (req.body.name || type.name),
				};
				type.update(data).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'group_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.type = (req, res, next) => {
		let type_id = parseInt(req.params.id || 0);
		async.parallel({
			type: (cb) => {
				if(req.params.id == 0) {
					var mock = Models.UserType.build();
					cb(null, mock.dataValues);
				} else {
					Models.UserType.findById(type_id)
					.then((user) => cb(null, user))
					.catch((err) => res.status(202).json({'error':'internal_error'}));
				}
			},
			users: (cb) => {
				Models.User.findAll({where:{type:type_id}, attributes:['id','nick_name','first_name','last_name','email','is_blocked','type','created_at'], raw: true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			menus: (cb) => {
				Models.Menu.findAll({where:{nested_in:0},attributes:['id','name'],raw:true})
				.then((results) => {
					(async function loopthrogh(x) {
						if(x < 0) return cb(null, results)
						try {
							results[x].nestings = await Models.Menu.findAll({where:{nested_in:results[x].id},attributes:['id','name'],raw:true});
						} catch(e) { 
							results[x].nestings = [];
						}
						loopthrogh(--x);
					})(results.length - 1);					
				}).catch((err) => cb(null, []));
			},
			otypes: (cb) => {
				Models.OrderType.findAll({attributes:['id','name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			osources: (cb) => {
				Models.Partner.findAll({attributes:['id','name','domain'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.types = (req, res, next) => {
		let type_id = 3;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 15;
      	let limits = page * perpage - perpage + ', ' + perpage;
		let sortfields = ['id', 'created_at', 'updated_at', 'name', 'users_in'];
		let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
		let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;  
		let conditions = ``;
		if(keyword) conditions += ` and (name like '%${keyword}%'`; 	
		connection.execute(`
			select id, name, updated_at, (select count(id) from users where users.type = users_types.id) as users_in
			from users_types where 1 ${conditions} 
			order by ${sortfield} ${sortdir} limit ${limits}`, { raw: true })
		.then((types) => {
			let response = { types: { list: types } };
			connection.executeOne(`select count(id) as total from users_types where 1 ${conditions} limit 1`, {raw: true})
			.then(count => {
	            response.types.total = count.total;
	            let pages = Math.ceil(count.total/perpage);
	            response.types.pagination = utils.paginate(page, perpage, pages, 3);
		    	res.status(200).json(response);
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};

	controller.payoffRequests = (req, res, next) => {
		async.parallel({
			requests: (cb) => {
		      	let page = req.query.page || 1;
				let perpage = req.query.perpage || 15;
		      	let limits = page * perpage - perpage + ', ' + perpage;
				let sortfields = ['id', 'created_at', 'status', 'user_id', 'amount'];
				let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
				let sortfield = sortfields.includes(req.query.sort) ? 'upr.' + req.query.sort : 'upr.' + sortfields[0];
				let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;  
				let conditions = ``;
				if(keyword) conditions += ` and (upr.id like '${keyword}%' or users.nick_name like '%${keyword}%' or users.id like '%${keyword}%') or method_name like '%${keyword}%')`; 	
				connection.execute(`
					select upr.id, upr.status, upr.prop, upr.country, upr.comment, upr.created_at, upr.amount, 
					upr.currency, upr.method_id, users.id as user_id, users.nick_name as user_name,
					(select name from users_payout_requests_statuses where id = upr.status limit 1) as status_name,
					(select name from users_pay_methods where id = upr.method_id limit 1) as method_name,
					coalesce((select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1), 0) as user_balance,
					(select name from currencies where id = users.currency_id limit 1) as user_currency,
					txs.system_number as tx_system_number
					from users_payout_requests upr 
					left join txs on txs.id = upr.tx_id
					left join users on users.id = upr.user_id
					where 1 ${conditions} order by ${sortfield} ${sortdir} limit ${limits}`, { raw: true })
				.then((requests) => {
					let response = { list: requests };
					connection.executeOne(`
						select count(upr.id) as total 
						from users_payout_requests upr
						left join txs on txs.id = upr.tx_id
						left join users on users.id = upr.user_id
						where 1 ${conditions} limit 1`, {raw: true})
					.then(count => {
			            let pages = Math.ceil(count.total/perpage);
			            response.total = count.total;
			            response.pagination = utils.paginate(page, perpage, pages, 3);
				    	cb(null, response);
					}).catch((err) => res.status(202).json({'error':'internal_error'}));
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			},
			statuses: (cb) => {
				Models.PayoutRequestStatus.findAll({attributes:['id','name'], raw: true})
				.then(results => cb(null, results))
				.catch(err => cb(null, []));
			},
			methods: (cb) => {
				Models.PayMethod.findAll({attributes:['id','name'], raw: true})
				.then(results => cb(null, results))
				.catch(err => cb(null, []));
			},
			currencies: (cb) => {
				Models.Currency.findAll({attributes:['id','name','sign'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.payoffRequest = (req, res, next) => {
		if(req.params.id) {
			let req_id = parseInt(req.params.id);
			async.parallel({
				request: (cb) => {
					connection.executeOne(`
						select upr.id, upr.status, upr.prop, upr.country, upr.comment, upr.created_at, upr.amount, 
						upr.currency, upr.method_id, users.id as user_id, users.nick_name as user_name,
						(select name from users_payout_requests_statuses where id = upr.status limit 1) as status_name,
						(select name from users_pay_methods where id = upr.method_id limit 1) as method_name,
						coalesce((select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1), 0) as user_balance,
						(select name from currencies where id = users.currency_id limit 1) as user_currency,
						txs.system_number as tx_system_number
						from users_payout_requests upr 
						left join txs on txs.id = upr.tx_id
						left join users on users.id = upr.user_id
						where upr.id = ${req_id} limit 1`,{raw: true})
					.then((request) => cb(null, request))
					.catch((err) => res.status(202).json({'error':err + 'request_not_found'}));
				},
				tx: (cb) => {
					connection.executeOne(`
						select txs.id, txs.system_number, txs.status, txs.created_at, txs.comment,
						txs.type, txs.user_id, cast(txs.amount AS decimal(19,2)) as amount,
						(select name from currencies where id = txs.currency_id) as currency_name, 
						(select name from txs_types where id = txs.type) as type_name, 
						(select name from txs_statuses where id = txs.status) as status_name
						from txs
						left join users_payout_requests upr on upr.tx_id = txs.id
						where upr.id = ${req_id} limit 1`, {raw: true})
					.then((tx) => cb(null, tx))
					.catch((err) => cb(null, null));	
				}
			}, (err, results) => {
				setTimeout(() => {
					res.status(200).json(results);
				}, 1000)
			});
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.updatePayoffRequests = (req, res, next) => {
		if(req.params.id) {
			let req_id = parseInt(req.params.id);
			connection.executeOne(`
				select upr.*, users.currency_id, txs.id as tx, txs.system_number as tx_number
				from users_payout_requests upr
				left join txs on txs.id = upr.tx_id
				left join users on users.id = upr.user_id
				where upr.id = ${req_id} limit 1`, {model: Models.PayoutRequest})
			.then((request) => {
				if(!request) return res.status(202).json({'error':'request_not_found'});
				let data = { 
					status: (req.body.status || request.status),
					prop: (req.body.prop || request.prop),
					country: (req.body.country || request.country),
					comment: (req.body.comment || request.comment),
					amount: (req.body.amount || request.amount),
					tx_id: request.tx_id,
				};
				(async () => {
					let tx_number = request.dataValues.tx_number;
					if(!request.dataValues.tx && data.status == 3) {
						try {
							let tx = await Models.Tx.create({
								system_number: request.user_id,
								comment: request.comment,
								user_id: request.user_id,
								amount: 0 - Math.abs(request.amount),
								currency_id: request.dataValues.currency_id,
								type: 2,
								status: 3,
							});
							data.tx_id = tx.id;
							tx_number = tx.system_number;
						} catch(e) {
							data.tx_id = 0;
						}
					}
					request.update(data).then(() => {
			    		res.status(200).json({'status':'ok', 'tx': tx_number});
					}).catch((err) => res.status(202).json({'error':'internal_error'}));
				})();
			}).catch((err) => res.status(202).json({'error':'request_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.removePayoffRequests = (req, res, next) => {
		if(req.params.id) {
			Models.PayoutRequest.findById(req.params.id).then((request) => {
				request.destroy().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'request_not_found'}));
			}).catch((err) => res.status(202).json({'error':'request_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.block = (req, res, next) => {
		if(req.body.id) {
			Models.User.findById(req.body.id).then((user) => {
				user.update({ is_blocked: req.body.is_blocked }).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.approve = (req, res, next) => {
		if(req.body.id) {
			Models.User.findById(req.body.id).then((user) => {
				user.update({ is_approved: req.body.is_approved }).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.all = (req, res, next) => {
		let type_id = 3;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 15;
		let approved = parseInt(req.query.approved || 0);
		let block = parseInt(req.query.block || 0);
		let type = parseInt(req.query.type || 0);
		let working = parseInt(req.query.working || 0);
      	let limits = page * perpage - perpage + ', ' + perpage;
		let sortfields = ['id', 'created_at', 'first_name', 'nick_name', 'balance', 'active_order', 'is_active'];
		let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
		let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;     
		let havings = ``;
		let conditions = ``;
		if(approved) havings += ` and is_approved = ${approved == 1 ? 0 : 1}`; 
		if(working) havings += ` and active_order ${working == 1 ? 'is not' : 'is'} null`; 
		if(block) conditions += ` and is_blocked = ${block == 1 ? 0 : 1}`; 
		if(type) conditions += ` and type = ${type}`; 
		if(keyword) conditions += ` and (nick_name like '%${keyword}%' or first_name like '%${keyword}%' or last_name like '%${keyword}%' or email like '%${keyword}%' or phone like '%${keyword}%' or skype like '%${keyword}%' or discord like '%${keyword}%' or id like '${keyword}%')`; 	
		let query = 
			`select id, login, email, first_name, last_name, nick_name, is_blocked, is_approved, avatar, country, phone, skype, discord, created_at, rating, type,
			(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) balance,
			(select name from currencies where id = users.currency_id limit 1) as currency,
			(select name from users_types where id = users.type limit 1) as type_name,
			(select system_number from orders where status in (5,6,9) and (worker_id = users.id or client_id = users.id) limit 1) as active_order
			from users 
			where 1 ${conditions} 
			having 1 ${havings}
			order by type asc, ${sortfield} ${sortdir} 
			limit ${limits}`;
		connection.execute(query, { raw: true })
		.then((users) => {
			let response = { users: { list: users } };
			connection.executeOne(`select count(id) as total from users where 1 ${conditions} limit 1`, {raw: true})
			.then(count => {
	            response.users.total = count.total;
	            let pages = Math.ceil(count.total/perpage);
	            response.users.pagination = utils.paginate(page, perpage, pages, 3);
		    	res.status(200).json(response);
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};

	controller.user = (req, res, next) => {
		let user_id = parseInt(req.params.id || 0);
		async.parallel({
			user: (cb) => {
				if(req.params.id == 0) {
					var mock = Models.User.build();
					cb(null, mock.dataValues);
				} else {
					connection.executeOne(
						`select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, deposit, type,
						 rating, rating_id, mmr_solo, phone, skype, discord, vkontakte, facebook, instagram, youtube, twitter, dotabuff, 
						 is_approved, created_at, country, currency_id, language, birth_date, permissions, order_permissions, heroes, lanes, 
						(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) as balance,
						(select system_number from orders where status in (5,6,9) and worker_id = users.id limit 1) as active_order,
						(select name from currencies where id = users.currency_id limit 1) as currency
						from users where id = ${user_id} limit 1`, { raw: true })
					.then((user) => {
						if(!user) cb(null, []);
						if(!fs.existsSync(storage.spaces.avatars + user.avatar)) {
							user.avatar = 'mock.png';
						}
						user.permissions = utils.jsonDecode(user.permissions) || [];
						user.order_permissions = utils.jsonDecode(user.order_permissions) || [];
						user.heroes = utils.jsonDecode(user.heroes) || [];
						user.lanes = utils.jsonDecode(user.lanes) || [];
						cb(null, user);
					})
					.catch((err) => res.status(202).json({'error':'internal_error'}));
				}
			},
			orders: (cb) => {
				connection.execute(
					`select o.type,o.client_comment,o.status,o.deadline,o.system_number,o.created_at,o.amount,o.amount_paid,oh.salary as salary,
				  	c.name as currency_name, c.sign as currency_sign, p.id as partner_id, p.name as partner_name, p.domain as partner_domain,
				  	u.nick_name as client_name, u.id as client_id,
				  	(select name from orders_statuses where id = o.status limit 1) as status_name,
				  	(select name from orders_types where id = o.type limit 1) as type_name
				  	from orders o
				  	left join users u on u.id = o.client_id
				  	left join partners p on p.id = o.partner_id
				  	left join currencies c on c.id = o.currency_id
				  	left join orders_histories oh on oh.order_id = o.id
				  	where oh.worker_id = ${user_id} and oh.action = 2
				  	order by oh.created_at`, {raw: true})
				.then((orders) => cb(null, orders))
				.catch((err) => cb(null, []));
			},
			menus: (cb) => {
				Models.Menu.findAll({where:{nested_in:0},attributes:['id','name'],raw:true})
				.then((results) => {
					(async function loopthrogh(x) {
						if(x < 0) return cb(null, results)
						try {
							results[x].nestings = await Models.Menu.findAll({where:{nested_in:results[x].id},attributes:['id','name'],raw:true});
						} catch(e) { 
							results[x].nestings = [];
						}
						loopthrogh(--x);
					})(results.length - 1);					
				}).catch((err) => cb(null, []));
			},
			otypes: (cb) => {
				Models.OrderType.findAll({attributes:['id','name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			osources: (cb) => {
				Models.Partner.findAll({attributes:['id','name','domain'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			ratings: (cb) => {
				Models.BoosterPriceCategory.findAll({attributes:['id','name','factor','from','till'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			txs: (cb) => {
				connection.execute(`
					select txs.system_number, txs.created_at, txs.status, txs.type, cast(txs.amount AS decimal(19,2)) as amount,
					(select name from currencies where id = txs.currency_id) as currency_name, 
					(select name from txs_types where id = txs.type) as type_name, 
					(select name from txs_statuses where id = txs.status) as status_name
					from txs 
					where txs.user_id = ${user_id} 
					order by txs.id desc`, { raw: true })
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			currencies: (cb) => {
				Models.Currency.findAll({attributes:['id','name','sign'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			languages: (cb) => {
				Models.Language.findAll({attributes:['id','name','code'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			countries: (cb) => {
				Models.Country.findAll({attributes:['name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.userUpdate = (req, res, next) => {
		if(req.params.id) {
			Models.User.findById(req.body.id).then((user) => {
				let data = { 
					permissions: (utils.jsonDecode(req.body.permissions) || user.permissions),
					order_permissions: (utils.jsonDecode(req.body.order_permissions) || user.order_permissions),
					lanes: (utils.jsonDecode(req.body.lanes) || user.lanes),
					heroes: (utils.jsonDecode(req.body.heroes) || user.heroes),
					rating_id: (req.body.rating_id || user.rating_id),
					rating: (req.body.rating || user.rating),
					is_approved: (req.body.is_approved || user.is_approved),
					deposit: (req.body.deposit || user.deposit),
					mmr_solo: (req.body.mmr_solo || user.mmr_solo),
					vkontakte: (req.body.vkontakte || user.vkontakte),
					facebook: (req.body.facebook || user.facebook),
					instagram: (req.body.instagram || user.instagram),
					youtube: (req.body.youtube || user.youtube),
					twitter: (req.body.twitter || user.twitter),
					dotabuff: (req.body.dotabuff || user.dotabuff),
					currency_id: (req.body.currency_id || user.currency_id),
					discord: (req.body.discord || user.discord),
					skype: (req.body.skype || user.skype),
					phone: (req.body.phone || user.phone),
					country: (req.body.country || user.country),
					nick_name: (req.body.nick_name || user.nick_name),
					last_name: (req.body.last_name || user.last_name),
					first_name: (req.body.first_name || user.first_name),
					email: (req.body.email || user.email),
					login: (req.body.login || user.login),
					type: (req.body.type || user.type),
					password: (req.body.password && req.body.password.length >= 8 ? md5(req.body.password) : user.password),
				};
				if(typeof req.file != typeof undefined) {
					data.avatar = req.file.filename;
					utils.image(storage.spaces.avatars + data.avatar).resize('avatar');
				}
				user.update(data).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.remove = (req, res, next) => {
		if(req.params.id) {
			Models.User.findById(req.params.id).then((user) => {
				Models.UserArchive.create(user.dataValues).then(r => {
					user.destroy().then(() => {
			    		res.status(200).json({'status':'ok'});
					}).catch((err) => res.status(202).json({'error': 'internal_error'}));
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.clientCreate = (req, res, next) => {
		if(!req.body.password || 
			req.body.password.length < 8 ||
			!utils.isEmail(req.body.login)) {
			return res.status(202).json({'error':'bad_parameters'});
		}
		Models.User.findOne({where:{login:req.body.login}}).then(user => {
			if(user) {
				res.status(202).json({'error':'login_exists'});
				return null;
			}
			var mock = Models.User.build();
			mock.type = 4;
			mock.is_blocked = (req.body.is_blocked || mock.is_blocked);
			mock.currency_id = (req.body.currency_id || mock.currency_id);
			mock.discord = (req.body.discord || mock.discord);
			mock.skype = (req.body.skype || mock.skype);
			mock.phone = (req.body.phone || mock.phone);
			mock.country = (req.body.country || mock.country);
			mock.nick_name = (req.body.nick_name || mock.nick_name);
			mock.last_name = (req.body.last_name || mock.last_name);
			mock.first_name = (req.body.first_name || mock.first_name);
			mock.email = (req.body.email || mock.email);
			mock.login = (req.body.login || mock.login);
			mock.password = md5(req.body.password);
			if(typeof req.file != typeof undefined) {
				mock.avatar = req.file.filename;
				utils.image(storage.spaces.avatars + mock.avatar).resize('avatar');
			}
			mock.save().then((user) => {
	    		res.status(200).json({status:'ok',id:user.id});
			}).catch((err) => res.status(202).json({'error':'validation_error'}));
		}).catch(e => res.status(202).json({'error':'validation_error'}));
	};

	controller.clientUpdate = (req, res, next) => {
		if(req.params.id) {
			Models.User.findById(req.body.id).then((user) => {
				let data = { 
					is_blocked: (req.body.is_blocked || user.is_blocked),
					currency_id: (req.body.currency_id || user.currency_id),
					discord: (req.body.discord || user.discord),
					skype: (req.body.skype || user.skype),
					phone: (req.body.phone || user.phone),
					country: (req.body.country || user.country),
					nick_name: (req.body.nick_name || user.nick_name),
					last_name: (req.body.last_name || user.last_name),
					first_name: (req.body.first_name || user.first_name),
					email: (req.body.email || user.email),
					login: (req.body.login || user.login),
					password: (req.body.password && req.body.password.length >= 8 ? md5(req.body.password) : user.password),
				};
				if(typeof req.file != typeof undefined) {
					data.avatar = req.file.filename;
					utils.image(storage.spaces.avatars + data.avatar).resize('avatar');
				}
				user.update(data).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.client = (req, res, next) => {
		let user_id = parseInt(req.params.id || 0);
		async.parallel({
			user: (cb) => {
				if(req.params.id == 0) {
					var mock = Models.User.build();
					cb(null, mock.dataValues);
				} else {
					connection.executeOne(
						`select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country,
						 phone, skype, discord, created_at, country, currency_id, language, birth_date,
						(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) as balance,
						(select name from currencies where id = users.currency_id limit 1) as currency,
						(select sum(amount) from orders where client_id = users.id limit 1) as orders_amount,
						(select system_number from orders where client_id = users.id and status in(5,6,9) limit 1) as active_order
						from users where id = ${user_id} limit 1`, { raw: true })
					.then((user) => cb(null, user))
					.catch((err) => res.status(202).json({'error':'internal_error'}));
				}
			},
			orders: (cb) => {
				connection.execute(`
				  	select o.id, o.client_comment,o.status,o.system_number,o.created_at, o.deadline, o.amount, o.amount_paid, o.client_id, 
				  	c.name as currency_name, c.sign as currency_sign, p.name as partner_name, p.domain as partner_domain,
				  	(select name from orders_statuses where id = o.status) as status_name,
				  	(select name from orders_types where id = o.type) as type_name
				  	from orders o
				  	left join partners p on p.id = o.partner_id
				  	left join currencies c on c.id = o.currency_id
				  	where o.client_id = ${user_id}
					order by o.id desc`, { raw: true })
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			txs: (cb) => {
				connection.execute(`
					select txs.system_number, txs.created_at, txs.status, txs.type, cast(txs.amount AS decimal(19,2)) as amount,
					(select name from currencies where id = txs.currency_id) as currency_name, 
					(select name from txs_types where id = txs.type) as type_name, 
					(select name from txs_statuses where id = txs.status) as status_name
					from txs 
					where txs.user_id = ${user_id} 
					and txs.type in (1, 2)
					order by txs.id desc`, { raw: true })
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			reviews: (cb) => {
				connection.execute(`
					select ur.comment, ur.mark, ur.created_at,
					(select system_number from orders where id = ur.order_id) as order_number,
					(select nick_name from users where id = ur.client_id) as author_name,
					(select avatar from users where id = ur.client_id) as author_avatar
					from users_reviews ur 
					where ur.client_id = ${user_id} 
					order by ur.id desc`, {raw: true})
				.then((res) => {
					cb(null, res);
				})
				.catch((err) => {
					cb(null, []);
				});
			},
			currencies: (cb) => {
				Models.Currency.findAll({attributes:['id','name','sign'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			languages: (cb) => {
				Models.Language.findAll({attributes:['id','name','code'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			countries: (cb) => {
				Models.Country.findAll({attributes:['name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.clients = (req, res, next) => {
		let type_id = 4;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 15;
      	let limits = page * perpage - perpage + ', ' + perpage;
		let sortfields = ['id', 'created_at', 'first_name', 'nick_name', 'balance', 'orders_count', 'orders_amount'];
		let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
		let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;     
		let conditions = ``;
		if(keyword) conditions += `and (nick_name like '%${keyword}%' or first_name like '%${keyword}%' or last_name like '%${keyword}%' or email like '%${keyword}%' or phone like '%${keyword}%' or skype like '%${keyword}%' or discord like '%${keyword}%' or id like '${keyword}%')`; 	
		connection.execute(
			`select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, phone, skype, discord, created_at,
			(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) balance,
			(select name from currencies where id = users.currency_id limit 1) as currency,
			(select count(id) from orders where client_id = users.id limit 1) as orders_count,
			(select sum(amount) from orders where client_id = users.id limit 1) as orders_amount,
			(select system_number from orders where status in (5,6,9) and client_id = users.id limit 1) as active_order
			from users where type = ${type_id} ${conditions} order by ${sortfield} ${sortdir} limit ${limits}`, { raw: true })
		.then((users) => {
			let response = { users: { list: users } };
			connection.executeOne(`select count(id) as total from users where type = ${type_id} ${conditions} limit 1`, {raw: true})
			.then(count => {
	            response.users.total = count.total;
	            let pages = Math.ceil(count.total/perpage);
	            response.users.pagination = utils.paginate(page, perpage, pages, 3);
		    	res.status(200).json(response);
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};

	controller.boosterCreate = (req, res, next) => {
		if(!req.body.password || 
			req.body.password.length < 8 ||
			!utils.isEmail(req.body.login)) {
			return res.status(202).json({'error':'bad_parameters'});
		}
		Models.User.findOne({where:{login:req.body.login}}).then(user => {
			if(user) {
				res.status(202).json({'error':'login_exists'});
				return null;
			}
			var mock = Models.User.build();
			mock.type = 3;
			mock.is_blocked = (req.body.is_blocked || mock.is_blocked);
			mock.currency_id = (req.body.currency_id || mock.currency_id);
			mock.discord = (req.body.discord || mock.discord);
			mock.skype = (req.body.skype || mock.skype);
			mock.phone = (req.body.phone || mock.phone);
			mock.country = (req.body.country || mock.country);
			mock.nick_name = (req.body.nick_name || mock.nick_name);
			mock.last_name = (req.body.last_name || mock.last_name);
			mock.first_name = (req.body.first_name || mock.first_name);
			mock.email = (req.body.email || mock.email);
			mock.login = (req.body.login || mock.login);
			mock.password = md5(req.body.password);
			mock.vkontakte = (req.body.vkontakte || mock.vkontakte);
			mock.facebook = (req.body.facebook || mock.facebook);
			mock.instagram = (req.body.instagram || mock.instagram);
			mock.youtube = (req.body.youtube || mock.youtube);
			mock.twitter = (req.body.twitter || mock.twitter);
			mock.dotabuff = (req.body.dotabuff || mock.dotabuff);
			mock.is_approved = (req.body.is_approved || mock.is_approved);
			mock.deposit = (req.body.deposit || mock.deposit);
			mock.rating = (req.body.rating || mock.rating);
			mock.rating_id = (req.body.rating_id || mock.rating_id);
			mock.heroes = (utils.jsonDecode(req.body.heroes) || []);
			mock.lanes = (utils.jsonDecode(req.body.lanes) || []);
			mock.permissions = (utils.jsonDecode(req.body.permissions) || {});
			mock.order_permissions = (utils.jsonDecode(req.body.order_permissions) || {});
			if(typeof req.file != typeof undefined) {
				mock.avatar = req.file.filename;
				utils.image(storage.spaces.avatars + mock.avatar).resize('avatar');
			}
			mock.save().then((user) => {
	    		res.status(200).json({status:'ok',id:user.id});
			}).catch((err) => res.status(202).json({'error':'validation_error'}));
		}).catch((err) => res.status(202).json({'error':'validation_error'}));
	};

	controller.boosters = (req, res, next) => {
		let type_id = 3;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 15;
		let activity = parseInt(req.query.activity || 0);
		let block = parseInt(req.query.block || 0);
		let working = parseInt(req.query.working || 0);
      	let limits = page * perpage - perpage + ', ' + perpage;
		let sortfields = ['id', 'created_at', 'first_name', 'nick_name', 'balance', 'active_order', 'is_active'];
		let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
		let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;     
		let havings = ``;
		let conditions = ``;
		if(activity) havings += ` and is_active = ${activity == 1 ? 0 : 1}`; 
		if(working) havings += ` and active_order ${working == 1 ? 'is not' : 'is'} null`; 
		if(block) conditions += ` and is_blocked = ${block == 1 ? 0 : 1}`; 
		if(keyword) conditions += ` and (nick_name like '%${keyword}%' or first_name like '%${keyword}%' or last_name like '%${keyword}%' or email like '%${keyword}%' or phone like '%${keyword}%' or skype like '%${keyword}%' or discord like '%${keyword}%' or id like '${keyword}%')`; 	
		let query = 
			`select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, phone, skype, discord, created_at, mmr_solo, rating,
			(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) balance,
			(select name from currencies where id = users.currency_id limit 1) as currency,
			(select sum(amount) from txs where user_id = users.id and txs.status = 3 and (txs.type = 1 or txs.type = 3) limit 1) as earned,
			(select system_number from orders where status in (5,6,9) and worker_id = users.id limit 1) as active_order,
			if((select id from orders_histories where worker_id = users.id and action = 1 and DATE(created_at) > '${activity_date}' limit 1), 1, 0) as is_active
			from users 
			where type = ${type_id} ${conditions} 
			having 1 ${havings}
			order by ${sortfield} ${sortdir} 
			limit ${limits}`;
		connection.execute(query, { raw: true })
		.then((users) => {
			let response = { users: { list: users } };
			connection.executeOne(`select count(id) as total from users where type = ${type_id} ${conditions} limit 1`, {raw: true})
			.then(count => {
	            response.users.total = count.total;
	            let pages = Math.ceil(count.total/perpage);
	            response.users.pagination = utils.paginate(page, perpage, pages, 3);
		    	res.status(200).json(response);
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};

	controller.booster = (req, res, next) => {
		let user_id = parseInt(req.params.id || 0);
		async.parallel({
			user: (cb) => {
				if(req.params.id == 0) {
					var mock = Models.User.build();
					cb(null, mock.dataValues);
				} else {
					connection.executeOne(
						`select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, deposit, type,
						 rating, rating_id, mmr_solo, phone, skype, discord, vkontakte, facebook, instagram, youtube, twitter, dotabuff, 
						 is_approved, created_at, country, currency_id, language, birth_date, permissions, order_permissions, heroes, lanes, 
						(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) as balance,
						(select system_number from orders where status in (5,6,9) and worker_id = users.id limit 1) as active_order,
						(select name from currencies where id = users.currency_id limit 1) as currency
						from users where id = ${user_id} and type = 3 limit 1`, { raw: true })
					.then((user) => {
						if(!user) cb(null, []);
						if(!fs.existsSync(storage.spaces.avatars + user.avatar)) {
							user.avatar = 'mock.png';
						}
						user.permissions = utils.jsonDecode(user.permissions) || [];
						user.order_permissions = utils.jsonDecode(user.order_permissions) || [];
						user.heroes = utils.jsonDecode(user.heroes) || [];
						user.lanes = utils.jsonDecode(user.lanes) || [];
						cb(null, user);
					})
					.catch((err) => res.status(202).json({'error':'internal_error'}));
				}
			},
			orders: (cb) => {
				connection.execute(
					`select o.type,o.client_comment,o.status,o.deadline,o.system_number,o.created_at,o.amount,o.amount_paid,oh.salary as salary,
				  	c.name as currency_name, c.sign as currency_sign, p.id as partner_id, p.name as partner_name, p.domain as partner_domain,
				  	u.nick_name as client_name, u.id as client_id,
				  	(select name from orders_statuses where id = o.status limit 1) as status_name,
				  	(select name from orders_types where id = o.type limit 1) as type_name
				  	from orders o
				  	left join users u on u.id = o.client_id
				  	left join partners p on p.id = o.partner_id
				  	left join currencies c on c.id = o.currency_id
				  	left join orders_histories oh on oh.order_id = o.id
				  	where oh.worker_id = ${user_id} and oh.action = 2
				  	order by oh.created_at`, {raw: true})
				.then((orders) => cb(null, orders))
				.catch((err) => cb(null, []));
			},
			ordersc: (cb) => {
				connection.execute(`
				  	select o.id, o.client_comment,o.status,o.system_number,o.created_at, o.deadline, o.amount, o.amount_paid, o.client_id, 
				  	c.name as currency_name, c.sign as currency_sign, p.name as partner_name, p.domain as partner_domain,
				  	(select name from orders_statuses where id = o.status) as status_name,
				  	(select name from orders_types where id = o.type) as type_name
				  	from orders o
				  	left join partners p on p.id = o.partner_id
				  	left join currencies c on c.id = o.currency_id
				  	where o.client_id = ${user_id}
					order by o.id desc`, { raw: true })
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			menus: (cb) => {
				Models.Menu.findAll({where:{nested_in:0},attributes:['id','name'],raw:true})
				.then((results) => {
					(async function loopthrogh(x) {
						if(x < 0) return cb(null, results)
						try {
							results[x].nestings = await Models.Menu.findAll({where:{nested_in:results[x].id},attributes:['id','name'],raw:true});
						} catch(e) { 
							results[x].nestings = [];
						}
						loopthrogh(--x);
					})(results.length - 1);					
				}).catch((err) => cb(null, []));
			},
			otypes: (cb) => {
				Models.OrderType.findAll({attributes:['id','name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			osources: (cb) => {
				Models.Partner.findAll({attributes:['id','name','domain'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			ratings: (cb) => {
				Models.BoosterPriceCategory.findAll({attributes:['id','name','factor','from','till'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			txs: (cb) => {
				connection.execute(`
					select txs.system_number, txs.created_at, txs.status, txs.type, cast(txs.amount AS decimal(19,2)) as amount,
					(select name from currencies where id = txs.currency_id) as currency_name, 
					(select name from txs_types where id = txs.type) as type_name, 
					(select name from txs_statuses where id = txs.status) as status_name
					from txs 
					where txs.user_id = ${user_id} 
					order by txs.id desc`, { raw: true })
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			currencies: (cb) => {
				Models.Currency.findAll({attributes:['id','name','sign'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			languages: (cb) => {
				Models.Language.findAll({attributes:['id','name','code'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			countries: (cb) => {
				Models.Country.findAll({attributes:['name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.boosterUpdate = (req, res, next) => {
		if(req.params.id) {
			Models.User.findById(req.body.id).then((user) => {
				let data = { 
					permissions: (utils.jsonDecode(req.body.permissions) || user.permissions),
					order_permissions: (utils.jsonDecode(req.body.order_permissions) || user.order_permissions),
					lanes: (utils.jsonDecode(req.body.lanes) || user.lanes),
					heroes: (utils.jsonDecode(req.body.heroes) || user.heroes),
					rating_id: (req.body.rating_id || user.rating_id),
					rating: (req.body.rating || user.rating),
					is_approved: (req.body.is_approved || user.is_approved),
					deposit: (req.body.deposit || user.deposit),
					mmr_solo: (req.body.mmr_solo || user.mmr_solo),
					vkontakte: (req.body.vkontakte || user.vkontakte),
					facebook: (req.body.facebook || user.facebook),
					instagram: (req.body.instagram || user.instagram),
					youtube: (req.body.youtube || user.youtube),
					twitter: (req.body.twitter || user.twitter),
					dotabuff: (req.body.dotabuff || user.dotabuff),
					currency_id: (req.body.currency_id || user.currency_id),
					discord: (req.body.discord || user.discord),
					skype: (req.body.skype || user.skype),
					phone: (req.body.phone || user.phone),
					country: (req.body.country || user.country),
					nick_name: (req.body.nick_name || user.nick_name),
					last_name: (req.body.last_name || user.last_name),
					first_name: (req.body.first_name || user.first_name),
					email: (req.body.email || user.email),
					login: (req.body.login || user.login),
					password: (req.body.password && req.body.password.length >= 8 ? md5(req.body.password) : user.password),
				};
				if(typeof req.file != typeof undefined) {
					data.avatar = req.file.filename;
					utils.image(storage.spaces.avatars + data.avatar).resize('avatar');
				}
				user.update(data).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.partners = (req, res, next) => {
		connection.executeOne(
			`select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, phone, skype, discord, created_at,
			(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) balance,
			(select name from currencies where id = users.currency_id limit 1) as currency,
			(select count(id) from orders where client_id = users.id limit 1) as orders_count,
			(select sum(amount) from orders where client_id = users.id limit 1) as orders_amount
			from users 
			where type = 4`, 
			{ raw: true })
		.then((results) => {
	    	res.status(200).json({ 'users': results });
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};

	controller.create = (req, res, next) => {
		if(!utils.isEmail(req.body.email) ||
			req.body.login.length < 5 ||
			req.body.password.length < 8) {
			res.status(202).json('bad parameters');
		}

		Models.User.findOrCreate({
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
			res.status(202).json({'error':'internal_error'});
		});
	};

	controller.events = (req, res, next) => {
		let user_id = req.app.user.id;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 10;
      	let limits = page * perpage - perpage + ', ' + perpage;		
		async.parallel({
			tickets: (cb) => {
				connection.execute(`
					select t.theme, t.system_number, t.created_at,
					(select name from tickets_statuses where id = t.status limit 1) as status_name,
					if(t.order_id > 0, (select system_number from orders where id = t.order_id limit 1), null) as order_number,
					if(t.tx_id > 0, (select system_number from txs where id = t.tx_id limit 1), null) as tx_number,
					(select user_name from chat_messages where room = t.system_number and user_id <> t.user_id order by id desc limit 1) as message_author,
					(select created_at from chat_messages where room = t.system_number and user_id <> t.user_id order by id desc limit 1) as message_date,
					(select text from chat_messages where room = t.system_number and user_id <> t.user_id order by id desc limit 1) as message_text
					from tickets t
					where t.user_id = ?
					and (select id from chat_messages where room = t.system_number and user_id <> t.user_id order by id desc limit 1)
					order by t.created_at desc`, { replacements: [user_id], raw: true})
				.then((tickets) => {
					cb(null, {list: tickets});
				})
				.catch((err) => {
					cb(null, {list: []});
				});
			},
			posts: (cb) => {
				newsController.getPosts()
				.then((posts) => {
					if(!posts.length) return cb(null, {list: []});
					(async function loopthrogh(x) {
						try {
							posts[x].comments = await connection.execute(`
								select pc.text, pc.created_at,
								(select nick_name from users where id = pc.user_id limit 1) as author, 
								(select avatar from users where id = pc.user_id limit 1) as avatar 
								from posts_comments pc 
								where pc.post_id = ? 
								and publish = ?
								order by pc.created_at asc`, {replacements: [posts[x].id, 1], raw: true}
							);
						} catch(err) { posts[x].comments = []; }
						if(x > 0)
							loopthrogh(--x);
						else 
							cb(null, {list: posts})
					})(posts.length - 1);
				})
				.catch((err) => {
					cb(null, {list: []});
				});
			},
			alerts: (cb) => {
				controller.getAlerts(user_id)
				.then((alerts) => {
					cb(null, {list: alerts});
				})
				.catch((err) => {
					cb(null, {list: []});
				});
			}
		}, (error, stack) => {
			if(error) return res.status(202).json({error:'internal_error'});
			res.status(200).json(stack);
		});
	};

	controller.pricelists = (req, res, next) => {
		let user = req.app.user;
		async.parallel({
			boosting: (cb) => {
				connection.execute(`
					select up.from, up.till, up.volume, c.name as currency_name, c.sign as currency_sign,
					if(u.currency_id = 1, up.rub * upc.factor, up.usd * upc.factor) as price
					from users_pricelists_boostings as up
				  	left join users as u on u.id = ?
				  	left join currencies as c on c.id = u.currency_id
				  	left join users_pricelists_categories as upc on upc.id = u.rating_id
				  	group by up.id order by up.from`, {replacements:[user.id]})
				.then(results => {
					cb(null, results)
				})
				.catch(e => cb(null, e))
			},
			medal_boost: (cb) => {
				connection.execute(`
					select up.title, up.rank, up.image, c.name as currency_name, c.sign as currency_sign,
					if(u.currency_id = 1, up.rub * upc.factor, up.usd * upc.factor) as price
					from users_pricelists_medals as up
				  	left join users as u on u.id = ?
				  	left join currencies as c on c.id = u.currency_id
				  	left join users_pricelists_categories as upc on upc.id = u.rating_id
				  	group by up.id order by up.id`, {replacements:[user.id]})
				.then(results => {
					cb(null, results)
				})
				.catch(e => cb(null, e))
			},
			calibration: (cb) => {
				cb(null, []);
			},
			training: (cb) => {
				cb(null, []);
			}
		}, (error, stack) => {
			if(error) return res.status(202).json({error:'internal_error'});
			res.status(200).json(stack);
		});
	};

	controller.selfLogsAndReviews = (req, res, next) => {
		let user_id = req.app.user.id;
		async.parallel({
			reviews: (cb) => {
				connection.execute(`
					select ur.comment, ur.mark, ur.created_at,
					(select system_number from orders where id = ur.order_id) as order_number,
					(select nick_name from users where id = ur.client_id) as author_name,
					(select avatar from users where id = ur.client_id) as author_avatar
					from users_reviews ur 
					where ur.user_id = ? 
					order by ur.id desc`, { replacements: [user_id], raw: true})
				.then((res) => {
					cb(null, res);
				})
				.catch((err) => {
					cb(null, []);
				});
			},
			logs: (cb) => {
				connection.execute(`
					select logs.message, logs.created_at, la.name, la.details,
					(select system_number from orders where id = logs.order_id) as order_number
					from logs
					left join logs_actions la on la.id = logs.action_id
					where logs.user_id = ? 
					order by logs.id desc limit 50`, { replacements: [user_id], raw: true})
				.then((res) => {
					cb(null, res);
				})
				.catch((err) => {
					cb(null, []);
				});
			}
		}, (err, results) => {
			if(err) return res.status(202).json({error:'internal_error'});
			res.status(200).json(results);
		});
	};

	controller.txs = (req, res, next) => {
		let user_id = req.app.user.id;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 10;
		let system_number = !req.query.tx || req.query.tx == 'null' ? null : req.query.tx;
      	let limits = page * perpage - perpage + ', ' + perpage;
      	let search_condition = system_number ? `and txs.system_number = '${system_number}'` : '';
		connection.execute(`
			select txs.system_number, txs.created_at, txs.status, txs.type, txs.comment, cast(txs.amount AS decimal(19,2)) as amount,
			(select name from currencies where id = txs.currency_id) as currency_name, 
			(select name from txs_types where id = txs.type) as type_name, 
			(select name from txs_statuses where id = txs.status) as status_name
			from txs 
			where txs.user_id = ? 
			${search_condition}
			order by txs.created_at limit ${limits}`, { replacements: [user_id], raw: true})
		.then((results) => {
			connection.execute(`
			select sts.id, sts.name, 
			(select count(txs.id) from txs where txs.status = sts.id and txs.user_id = ? ${search_condition}) as value
			from txs_statuses sts`, {replacements: [user_id], raw: true})
			.then(stats => {
				let total = stats.reduce((a, c) => a + c.value, 0);
	            let pages = Math.ceil(total/perpage);
	            let pagination = utils.paginate(page, perpage, pages, 3);
	            stats.forEach(e => { e.ratio = (100 / total * e.value).toFixed(2); });
				res.status(200).json({txs: results, pagination: pagination, stats: stats});
			})
			.catch(err => {
				res.status(202).json({error:'internal_error'});
			});
		})
		.catch((err) => {
			res.status(202).json({error:'internal_error'});
		});
	};

	controller.newPayoutRequest = (req, res, next) => {
		let user_id = req.app.user.id;
		Models.PayoutRequest.create({
			user_id: user_id,
			method_id: req.body.method_id,
			prop: req.body.prop,
			country: req.body.country,
			comment: req.body.comment,
			currency: req.body.currency,
			amount: req.body.amount
		}).then(request => {
			controller.getPayoutRequests(user_id).then(requests => {
				res.status(200).json({payouts: requests});
			});
		}).catch(e => {
			res.status(202).json({error:'internal_error'});
		});
	};

	controller.payoutRequests = (req, res, next) => {
		let user_id = req.app.user.id;
		async.parallel({
			payouts: (cb) => {
				controller.getPayoutRequests(user_id)
				.then(res => {
					cb(null, res);
				}).catch(e => {
					cb(null, null);
				});
			},
			methods: (cb) => {
				Models.PayMethod.findAll({attributes: ['id', 'name'], raw: true})
				.then(res => {
					cb(null, res);
				}).catch(e => {
					cb(null, null);
				});
			},
			props: (cb) => {
				connection.execute(`
					select upp.id, upp.prop, upp.default, upp.method_id, upp.country,
					(select name from users_pay_methods where id = upp.method_id limit 1) as method 
					from users_pay_props upp where user_id = ?`, 
					{replacements: [user_id], raw: true})
				.then(res => {
					cb(null, res);
				}).catch(e => {
					cb(null, null);
				});		
			},
			balance: (cb) => {
				controller.calculateBalance(user_id).then(res => {
					cb(null, res);
				}).catch(e => {
					cb(null, 0);
				});
			}
		}, (err, results) => {
	    	res.status(200).json(results);
		});
	};

	controller.me = (req, res, next) => {
		let user_id = req.app.user.id;
		async.parallel({
			user: (cb) => {
				connection.executeOne(
					`select id, type, permissions, order_permissions, lanes, heroes, first_name, last_name, nick_name, language, 
					is_approved, is_blocked, is_subscribed, language, avatar, country, phone, skype, discord, email,
					facebook, vkontakte, twitter, youtube, instagram, mmr_solo, mmr_party, dotabuff, rating, created_at,
					(select avg(mark) from users_reviews where user_id = users.id) as reviews_mark,
					(select count(id) from users_reviews where user_id = users.id) as reviews_total,
					if((select id from orders o where o.worker_id = users.id and (o.status = 6 or o.status = 9) limit 1), true, false) as is_busy,
					(select o.system_number from orders o where o.worker_id = users.id and (o.status = 6 or o.status = 9) limit 1) as active_order
					from users where id = ? limit 1`, { replacements: [req.app.user.id], raw: true, model: Models.User })
				.then((user) => {
					if(!fs.existsSync(storage.spaces.avatars + user.avatar)) {
						user.avatar = 'mock.png';
					}
					user.lanes = JSON.parse(user.lanes) || [];
					user.heroes = JSON.parse(user.heroes) || [];
					connection.execute(`
						select upp.id, upp.prop, upp.default, upp.method_id, upp.country,
						(select name from users_pay_methods where id = upp.method_id limit 1) as method 
						from users_pay_props upp where user_id = ?`, { replacements: [req.app.user.id], raw: true})
					.then(props => {
						user.props = props;
						cb(null, user);
					})
					.catch(e => {
						user.props = [];
						cb(null, user);
					})
				})
				.catch((err) => {
					return res.status(202).json({error:'internal_error'});
				});
			},
			reviews: (cb) => {
				connection.execute(`
					select ur.comment, ur.mark, ur.created_at,
					(select system_number from orders where id = ur.order_id) as order_number,
					(select nick_name from users where id = ur.client_id) as author_name,
					(select avatar from users where id = ur.client_id) as author_avatar
					from users_reviews ur 
					where ur.user_id = ? 
					order by ur.id desc`, { replacements: [user_id], raw: true})
				.then((res) => {
					cb(null, res);
				})
				.catch((err) => {
					cb(null, []);
				});
			},
			logs: (cb) => {
				connection.execute(`
					select logs.message, logs.created_at, la.name, la.details,
					(select system_number from orders where id = logs.order_id) as order_number
					from logs
					left join logs_actions la on la.id = logs.action_id
					where logs.user_id = ? 
					order by logs.id desc limit 50`, { replacements: [user_id], raw: true})
				.then((res) => {
					cb(null, res);
				})
				.catch((err) => {
					cb(null, []);
				});
			}
		}, (err, results) => {
			if(err) return res.status(202).json({error:'internal_error'});
			res.status(200).json(results);
		});		
	};

	controller.updateMe = (req, res, next) => {
		let user_id = parseInt(req.app.user.id);
		Models.User.findById(user_id).then(user => {
			if(!user) return res.status(202).json({'error':'user_not_found'});	
			if(typeof req.file != typeof undefined) {
				user.avatar = req.file.filename;
				utils.image(storage.spaces.avatars + user.avatar).resize('avatar');
			}
			let data = JSON.parse(req.body.user);
			user.nick_name = data.nick_name;
			user.first_name = data.first_name;
			user.last_name = data.last_name;
			user.mmr_solo = data.mmr_solo;
			user.mmr_party = data.mmr_party;
			user.lanes = utils.jsonDecode(data.lanes) || user.lanes;
			user.heroes = utils.jsonDecode(data.heroes) || user.heroes;
			user.email = data.email;
			user.country = data.country;
			user.phone = data.phone;
			user.skype = data.skype;
			user.discord = data.discord;
			user.vkontakte = data.vkontakte;
			user.facebook = data.facebook;
			user.instagram = data.instagram;
			user.twitter = data.twitter;
			user.dotabuff = data.dotabuff;
			user.is_configured = true;
			user.last_login = new Date();
			user.save().then(() => {
    			Models.Log.create({user_id: user.id, action_id: 4});
				res.status(200).json(user.avatar);
			});
			if(data.props.length) {
				Models.PayProp.destroy({ where: {user_id: user_id}}).then(() => {
					data.props.forEach(e => { 
						Models.PayProp.create({
							prop: e.prop, 
							method_id: e.method_id, 
							country: e.country, 
							user_id: user_id
						});
					});
				}).catch(console.log);
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});	
		});
	};

	controller.contacts = (req, res, next) => {
		Models.Contact.findAll({raw: true}).then(contacts => {
			res.status(200).json({contacts: contacts});
		}).catch(e => {
			res.status(202).json({'error':'internal_error'});
		});
	};

	controller.bonuses = (req, res, next) => {
		let types = [{id: 1, name: 'Бонусы', list: []},{id: 2, name: 'Штрафы', list: []}];
		Models.UserBonusPenalty.findAll({attributes: ['type','name','description','amount'], raw: true}).then(bonuses => {
			for(let x in types) {
				for(let y in bonuses) {
					if(bonuses[y].type == types[x].id)
						types[x].list.push(bonuses[y]);
				}
			}
			res.status(200).json({types: types});
		}).catch(e => {
			res.status(202).json({'error':'internal_error'});
		});
	};

	controller.changePassword = (req, res, next) => {
		let user_id = req.app.user.id;
		if(!req.body.old || req.body.old.length < 8 || !req.body.new || req.body.new.length < 8) {
			return res.status(202).json({'error':'bad_parameters'});
		}
		Models.User.findOne({where: {id: user_id, password: md5(req.body.old)}})
		.then((user) => {
    		if(user) {
    			user.update({password: md5(req.body.new)});
    			res.status(200).json();
    		} else {
    			res.status(202).json({'error':'incorrect_password'});
    		}
		})
		.catch((err) => {
	    	res.status(202).json({'error':'internal_error'});
		});
	};

	controller.balanceStatistics = async (req, res, next) => {
		let user = req.app.user;
		let data = [];
		let response = await controller.calculateBalanceDetailed(user.id);
		response.progress = await controller.getBalanceHistory(user);
		res.status(200).json(response);
	};

	controller.boostersStatistics = async (req, res, next) => {
		async.parallel({
			statistics: (cb) => {
				connection.executeOne(`
					select count(id) as boosters_total,
					(select count(distinct worker_id) from orders_histories where action = 1 and DATE(created_at) > '${activity_date}') as boosters_active,
					coalesce((select sum(amount) from txs where currency_id = 1 and user_id = users.id and txs.status = 3 and (txs.type = 1 or txs.type = 3) limit 1), 0) as total_earned_rub,
					coalesce((select sum(amount) from txs where currency_id = 2 and user_id = users.id and txs.status = 3 and (txs.type = 1 or txs.type = 3) limit 1), 0) as total_earned_usd,
					coalesce((select sum(amount) from txs where currency_id = 1 and user_id = users.id and txs.status = 3 and txs.type = 2 limit 1), 0) as total_deduced_rub,
					coalesce((select sum(amount) from txs where currency_id = 2 and user_id = users.id and txs.status = 3 and txs.type = 2 limit 1), 0) as total_deduced_usd,
					coalesce((select sum(amount) from txs where currency_id = 1 and user_id = users.id and txs.status = 3 limit 1), 0) as total_balance_rub,
					coalesce((select sum(amount) from txs where currency_id = 2 and user_id = users.id and txs.status = 3 limit 1), 0) as total_balance_usd
					from users where type = 3 limit 1`, { raw: true })
				.then((stats) => cb(null, stats))
				.catch((err) => cb(null, []));
			},
			active: (cb) => {
				connection.execute(`
					select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, phone, skype, discord, created_at, mmr_solo, rating,
					(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) balance,
					(select name from currencies where id = users.currency_id limit 1) as currency,
					(select system_number from orders where status in (5,6,9) and worker_id = users.id limit 1) as active_order,
					(select id from orders_histories where worker_id = users.id and action = 1 and DATE(created_at) > '${activity_date}' limit 1) as is_active
					from users 
					where type = 3 
					having is_active is not null
					order by balance limit 10`, { raw: true })
				.then((stats) => cb(null, stats))
				.catch((err) => cb(null, []));
			},
			free: (cb) => {
				connection.execute(`
					select id, login, email, first_name, last_name, nick_name, is_blocked, avatar, country, phone, skype, discord, created_at, mmr_solo, rating,
					(select sum(txs.amount) from txs where user_id = users.id and status = 3 limit 1) balance,
					(select name from currencies where id = users.currency_id limit 1) as currency,
					(select system_number from orders where status in (5,6,9) and worker_id = users.id limit 1) as active_order,
					(select id from orders_histories where worker_id = users.id and action = 1 and DATE(created_at) > '${activity_date}' limit 1) as is_active
					from users 
					where type = 3 
					having is_active is not null and active_order is null
					order by balance limit 10`, { raw: true })
				.then((stats) => cb(null, stats))
				.catch((err) => cb(null, []));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.boosterStatistics = async (req, res, next) => {
		let user = req.app.user;
		let data = [];
		let response = {};
		response.ratings = await controller.calculateWorkDetailed(user.id);
		response.ratings.progress = await controller.getRatingHistory(user);
		response.balance = await controller.calculateBalanceDetailed(user.id);
		response.balance.progress = await controller.getBalanceHistory(user);
		res.status(200).json(response);
	};

	controller.calculateBalance = (user_id) => {
		return connection.executeOne(`
			select sum(txs.amount) amount,
			(select name from currencies where id = (select currency_id from users where id = txs.user_id limit 1)) as currency
			from txs 
			where user_id = ? and status = ? limit 1`, 
			{replacements: [user_id, 3], raw: true}
		);
	};

	controller.calculateBalanceDetailed = (user_id) => {
		return connection.executeOne(`
			select 
			(select deposit from users where id = txs.user_id limit 1) as deposit,
			sum(if(txs.status = 3, txs.amount, 0)) as balance,
			sum(if(txs.status = 3 and (txs.type = 1 or txs.type = 3), txs.amount, 0)) as earned,
			sum(if(txs.status = 3 and (txs.type = 2), txs.amount, 0)) as deduced,
			sum(if(txs.status = 3 and (txs.type = 4), txs.amount, 0)) as withheld,
			(select name from currencies where id = (select currency_id from users where id = txs.user_id limit 1)) as currency
			from txs 
			where user_id = ? limit 1`, 
			{replacements: [user_id], raw: true}
		);
	};

	controller.calculateWorkDetailed = (user_id) => {
		return connection.executeOne(`
			select 
			sum(1) as orders_total,
			sum(if(oh.finisher = 1, 1, 0)) as orders_finished,
			avg(oh.rank) as average_rank,
			(select rating from users where id = oh.worker_id limit 1) as current_rank,
			(select sum(mmr_diff) from orders_reports where user_id = oh.worker_id and canceled = 0) as mmr_volume,
			(select avg(mark) from users_reviews where user_id = oh.worker_id) as reviews_mark,
			(select count(id) from users_reviews where user_id = oh.worker_id) as reviews_total
			from orders_histories oh 
			where oh.worker_id = ? and oh.action = ? limit 1`, 
			{replacements: [user_id, 2], raw: true}
		);
	};

	controller.getPayoutRequests = (user_id) => {
		return connection.execute(`
			select upr.id, upr.status, upr.prop, upr.country, upr.comment, upr.created_at, upr.amount, upr.currency,
			(select name from users_payout_requests_statuses where id = upr.status limit 1) as status_name,
			(select name from users_pay_methods where id = upr.method_id limit 1) as method,
			(select system_number from txs where id = upr.tx_id limit 1) as tx_number
			from users_payout_requests upr where upr.user_id = ?`,
			{replacements:[user_id], raw: true}
		);
	};

	controller.getBalanceHistory = async (user) => {
		let balance = 0;
		let dates = [];
		let datasets = {};
		return new Promise((resolve, reject) => {
			connection.execute(
				`select amount, created_at from txs where status = ? and user_id = ? order by created_at`, 
				{raw: true, replacements: [3, user.id]}
			).then(txs => {
				let date_first_tx = new Date(txs.length ? txs[0].created_at : user.created_at);
				let date_user_reg = new Date(user.created_at);
				let date_start = date_first_tx < date_user_reg ? date_first_tx : date_user_reg;
				let dates = utils.datesRange(date_start, new Date());
				dates.forEach(date => {
					let date_iso = moment(date).format('YYYY-MM-DD');
					let timestamp = moment(date).unix();
					let daily_txs = txs.filter(e => date_iso == moment(e.created_at).format('YYYY-MM-DD'));
					let balancepp = balance;
					if(daily_txs.length) {
						daily_txs.forEach(tx => {
							balance += tx.amount;
							datasets[timestamp] = { timestamp: timestamp, from: balancepp, change: balance - balancepp, amount: balance };
						});
					} else {
						datasets[timestamp] = { timestamp: timestamp, from: balancepp, change: 0, amount: balance };
					}
				});
				resolve(Object.values(datasets));
			}).catch(err => {
				resolve([]);
			});
		});
	}

	controller.getRatingHistory = async (user) => {
		let dates = [];
		let datasets = {};
		return new Promise((resolve, reject) => {
			connection.execute(
				`select rank, created_at from orders_histories where worker_id = ? and action = ? order by created_at`, 
				{raw: true, replacements: [user.id, 2]}
			).then(ranks => {
				let date_first_rank = new Date(ranks.length ? ranks[0].created_at : user.created_at);
				let date_user_reg = new Date(user.created_at);
				let date_start = date_first_rank < date_user_reg ? date_first_rank : date_user_reg;
				let dates = utils.datesRange(date_start, new Date());
				let rankpp = 0;
				dates.forEach(date => {
					let date_iso = moment(date).format('YYYY-MM-DD');
					let timestamp = moment(date).unix();
					let daily_ranks = ranks.filter(e => date_iso == moment(e.created_at).format('YYYY-MM-DD'));
					if(daily_ranks.length) {
						daily_ranks.forEach(e => {
							rankpp = e.rank;
							datasets[timestamp] = { timestamp: timestamp, rating: e.rank};
						});
					} else {
						datasets[timestamp] = { timestamp: timestamp, rating: rankpp};
					}
				});
				resolve(Object.values(datasets));
			}).catch(err => {
				resolve([]);
			});
		});
	}

	controller.getAlerts = (user_id) => {
		return connection.execute(`
			select r.title, r.note, r.created_at, r.dismissable, rt.name as type, 
			(select system_number from orders where id = r.order_id limit 1) as order_number
			from orders_reminders r
			left join orders_reminders_types rt on rt.id = r.type
			where r.user_id = ? and r.expires_at > ? order by r.id desc`, 
			{replacements: [user_id, moment().format("YYYY-MM-DD HH:mm:ss")], raw: true});
	}

	return controller;

};