const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const randstr = require('randomstring');

module.exports = (db) => {
	const newsController = require('./controller.news')(db);
	const controller = {};

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
			if(error) return res.status(500).json('internal_error');
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
			if(error) return res.status(500).json('internal_error');
			res.status(200).json(stack);
		});
	};

	controller.balanceStatistics = async (req, res, next) => {
		let user = req.app.user;
		let data = [];
		let response = await controller.calculateBalanceDetailed(user.id);
		response.progress = await controller.getBalanceHistory(user);
		res.status(200).json(response);
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

	controller.selfLogsAndReviews = (req, res, next) => {
		let user_id = req.app.user.id;
		async.parallel({
			reviews: (cb) => {
				connection.execute(`
					select ur.comment, ur.mark, ur.created_at,
					(select system_number from orders where id = ur.order_id) as order_number,
					(select nick_name from clients where id = ur.client_id) as author
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
			if(err) return res.status(500).json(err + 'internal_error');
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
				res.status(500).json(err + 'internal_error');
			});
		})
		.catch((err) => {
			res.status(500).json(err + 'internal_error');
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
			res.status(500).json(e + 'internal_error');
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
			res.status(500).json({'error':'internal_error'});
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
			res.status(500).json({'error':'internal_error' + err});
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
	    			Models.Log.create({user_id: user.id, action_id: 2});
					let token = utils.jwtSign(user, req.body.rememberMe);
					if(!fs.existsSync(path.join(__dirname, '..', '..', 'storage', 'cdn', 'avatars', user.avatar))) {
						user.avatar = 'mock.png';
					}
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
			res.status(500).json({'error':'internal_error ' + err});
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
				.then((results) => {
					try{
						results.lanes = JSON.parse(results.lanes);
						results.heroes = JSON.parse(results.heroes);
					} catch(e) { 
						results.lanes = [];
						results.heroes = [];
					}
					connection.execute(`
						select upp.id, upp.prop, upp.default, upp.method_id, upp.country,
						(select name from users_pay_methods where id = upp.method_id limit 1) as method 
						from users_pay_props upp where user_id = ?`, { replacements: [req.app.user.id], raw: true})
					.then(props => {
						results.props = props;
						cb(null, results);
					})
					.catch(e => {
						results.props = null;
						cb(null, results);
					})
				})
				.catch((err) => {
					return res.status(500).json(err + 'internal error');
				});
			},
			reviews: (cb) => {
				connection.execute(`
					select ur.comment, ur.mark, ur.created_at,
					(select system_number from orders where id = ur.order_id) as order_number,
					(select nick_name from clients where id = ur.client_id) as author
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
			if(err) return res.status(500).json({'error':'internal_error'});
			res.status(200).json(results);
		});		
	};

	controller.contacts = (req, res, next) => {
		Models.Contact.findAll({raw: true}).then(contacts => {
			res.status(200).json({contacts: contacts});
		}).catch(e => {
			res.status(500).json({'error':'internal_error'});
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
			res.status(500).json({'error':'internal_error'});
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
	    	res.status(500).json({'error':'internal_error' + err});
		});
	};

	controller.updateMe = (req, res, next) => {
		let user_id = parseInt(req.app.user.id);
		Models.User.findById(user_id).then(user => {
			if(!user) return res.status(404).json('user_not_found');	
			if(typeof req.file != typeof undefined) {
				// fs.unlink(path.join(__dirname, '..', '..', 'storage', 'cdn', 'avatars', user.avatar), (err) => {});
				user.avatar = req.file.filename;
			}
			let data = JSON.parse(req.body.user);
			user.nick_name = data.nick_name;
			user.first_name = data.first_name;
			user.last_name = data.last_name;
			user.mmr_solo = data.mmr_solo;
			user.mmr_party = data.mmr_party;
			user.lanes = JSON.stringify(data.lanes);
			user.heroes = JSON.stringify(data.heroes);
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
			res.status(500).json('internal_error');	
		});
	};

	controller.list = (req, res, next) => {
		connection.execute("select * from users", { model: Models.User })
		.then((results) => {
	    	res.status(200).json({ 'users': results });
		})
		.catch((err) => {
			res.status(500).json('internal error');
		});
	};

	controller.user = (req, res, next) => {
		connection.executeOne("select * from users where id = ? limit 1", { replacements: [req.params.id], model: Models.User })
		.then((results) => {
			if(results) res.status(200).json(results);
			else res.status(404).json('user_not_found');
		})
		.catch((err) => {
			res.status(500).json('internal error');
		});
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
			res.status(500).json('internal error');
		});
	};

	controller.update = (req, res, next) => {
		Models.User.findById(req.params.id)
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

	controller.remove = (req, res, next) => {
		Models.User.findById(req.params.id)
		.then((user) => {
			user.destroy();
    		res.status(200).json(user);
		})
		.catch((err) => {
	    	res.status(404).json('user not found');
		});
	    res.status(200).json({'users': [{'name':'savage'}]});
	};

	return controller;

};