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
	const controller = {};
	
	controller.block = (req, res, next) => {
		if(req.body.id) {
			Models.Partner.findById(req.body.id).then((partner) => {
				partner.update({ is_blocked: req.body.is_blocked }).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.approve = (req, res, next) => {
		if(req.body.id) {
			Models.Partner.findById(req.body.id).then((partner) => {
				partner.update({ is_approved: req.body.is_approved }).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'user_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.create = (req, res, next) => {
		if(!r) {
			res.status(202).json({'error':'bad_parameters'});
			return null;
		}
		Models.Partner.findOne({where:{login:req.body.login}}).then(partner => {
			if(partner) {
				res.status(202).json({'error':'login_exists'});
				return null;
			}
			var mock = Models.Partner.build();
			mock.is_blocked = (req.body.is_blocked || mock.is_blocked);
			mock.is_approved = (req.body.is_approved || mock.is_approved);
			mock.currency_id = (req.body.currency_id || mock.currency_id);
			mock.discord = (req.body.discord || mock.discord);
			mock.skype = (req.body.skype || mock.skype);
			mock.phone = (req.body.phone || mock.phone);
			mock.vkontakte = (req.body.vkontakte || mock.vkontakte);
			mock.facebook = (req.body.facebook || mock.facebook);
			mock.instagram = (req.body.instagram || mock.instagram);
			mock.save().then((user) => {
	    		res.status(200).json({status:'ok',id:user.id});
			}).catch((err) => {console.log(err), res.status(202).json({'error':'validation_error'})});
		}).catch((err) => {console.log(err), res.status(202).json({'error':'validation_error'})});
	};

	controller.remove = (req, res, next) => {
		if(req.params.id) {
			Models.Tx.findById(req.params.id).then((tx) => {
				tx.destroy().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'partner_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.update = (req, res, next) => {
		if(req.params.id) {
			Models.Tx.findById(req.body.id).then((tx) => {
				let data = { 
					comment: (req.body.comment || tx.comment),
					client_id: Math.abs(req.body.client_id || tx.client_id),
					amount: Math.abs(req.body.amount || tx.amount),
					currency_id: (req.body.currency_id || tx.currency_id),
					type: (req.body.type || tx.type),
					status: (req.body.status || tx.status),
				};
				if(data.type == 2 || data.type == 4) data.amount = 0 - data.amount;
				tx.update(data).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'tx_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.all = (req, res, next) => {
		async.parallel({
			txs: (cb) => {
		      	let page = req.query.page || 1;
				let perpage = req.query.perpage || 15;
		      	let limits = page * perpage - perpage + ', ' + perpage;
				let sortfields = ['id', 'created_at', 'system_number', 'status', 'type', 'amount', 'user_id'];
				let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
				let sortfield = sortfields.includes(req.query.sort) ? 'txs.' + req.query.sort : 'txs.' + sortfields[0];
				let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;    
		      	let utypes = typeof req.query.utype == 'object' ? req.query.utype.filter(e => parseInt(e)) : (parseInt(req.query.utype) ? [parseInt(req.query.utype)] : 0);
		      	let types = typeof req.query.type == 'object' ? req.query.type.filter(e => parseInt(e)) : (parseInt(req.query.type) ? [parseInt(req.query.type)] : 0);
		      	let statuses = typeof req.query.status == 'object' ? req.query.status.filter(e => parseInt(e)) : (parseInt(req.query.status) ? [parseInt(req.query.status)] : 0);
				let conditions = ``;
				if(keyword) conditions += ` and (orders.system_number like '%${keyword}%' or txs.system_number like '%${keyword}%' or txs.amount like '${keyword}%' or txs.user_id like '${keyword}%' or txs.user_id like '${keyword}%' or users.nick_name like '${keyword}%')`; 
				if(statuses) conditions += ` and txs.status in (${statuses.join(',')})`;
				if(types) conditions += ` and txs.type in (${types.join(',')})`;
				if(utypes) conditions += ` and users.type in (${utypes.join(',')})`;
				connection.execute(`
					select txs.id, txs.system_number, txs.currency_id, txs.created_at, txs.status, txs.comment,
					txs.type, txs.user_id, users.nick_name as user_name, cast(txs.amount AS decimal(19,2)) as amount,
					orders.system_number as order_number, 
					(select name from currencies where id = txs.currency_id) as currency_name, 
					(select name from txs_types where id = txs.type) as type_name, 
					(select name from txs_statuses where id = txs.status) as status_name
					from txs 
					left join users on users.id = txs.user_id
					left join orders on orders.id = txs.order_id
					where 1 ${conditions}
					order by ${sortfield} ${sortdir} limit ${limits}`, { raw: true })
				.then((txs) => {
					let results = { list: txs };
					connection.executeOne(`
						select count(txs.id) as total from txs 
						left join users on users.id = txs.user_id
						left join orders on orders.id = txs.order_id
						where 1 ${conditions} limit 1`, {raw: true})
					.then(count => {
			            let pages = Math.ceil(count.total/perpage);
			            results.total = count.total;
			            results.pagination = utils.paginate(page, perpage, pages, 3);
				    	cb(null, results);
					}).catch((err) => res.status(202).json({'error':err + 'internal_error'}));
				}).catch((err) => res.status(202).json({'error':err + 'internal_error'}));
			},
			statuses: (cb) => {
				Models.TxStatus.findAll({attributes:['id','name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			types: (cb) => {
				Models.TxType.findAll({attributes:['id','name'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			currencies: (cb) => {
				Models.Currency.findAll({attributes:['id','name','sign'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.tx = (req, res, next) => {
		let partner_id = parseInt(req.params.id || 0);
		async.parallel({
			info: (cb) => {
				if(req.params.id == 0) {
					var mock = Models.Partner.build();
					mock.login = controller.generateKey();
					cb(null, mock.dataValues);
				} else {
					connection.executeOne(
						`select id, login, name, domain, email, is_blocked, is_approved, avatar, 
						 country, phone, skype, discord, vkontakte, facebook, instagram, youtube, 
						 twitter, dotabuff, country, currency_id, language, created_at, 
						 (select count(id) from orders where partner_id = partners.id limit 1) as orders_count,
						 coalesce((select sum(amount) from orders where partner_id = partners.id limit 1), 0) as orders_amount,
					 	 coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id = partners.id limit 1), 0) as orders_amount_paid_rub,
					 	 coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id = partners.id limit 1), 0) as orders_amount_paid_usd,
						 (select name from currencies where id = partners.currency_id limit 1) as currency
						from partners where id = ${partner_id} limit 1`, { raw: true })
					.then((partner) => {
						if(!partner) cb(null, []);
						if(!fs.existsSync(storage.spaces.avatars + partner.avatar)) partner.avatar = 'mock.png';
						cb(null, partner);
					})
					.catch((err) => res.status(202).json({'error':'internal_error'}));
				}
			},
			orders: (cb) => {
				connection.execute(
					`select o.type,o.client_comment,o.status,o.deadline,o.system_number,o.created_at,o.amount,o.amount_paid,
				  	c.name as currency_name, c.sign as currency_sign, u.nick_name as client_name, u.id as client_id,
				  	(select name from orders_statuses where id = o.status limit 1) as status_name,
				  	(select name from orders_types where id = o.type limit 1) as type_name
				  	from orders o
				  	left join users u on u.id = o.client_id
				  	left join currencies c on c.id = o.currency_id
				  	where o.partner_id = ${partner_id}
				  	order by o.created_at desc`, {raw: true})
				.then((orders) => cb(null, orders))
				.catch((err) => cb(null, []));
			},
			txs: (cb) => {
				connection.execute(`
					select txs.system_number, txs.created_at, txs.status, txs.type, users.id as client_id, users.nick_name as client_name,
					cast(txs.amount AS decimal(19,2)) as amount, orders.system_number as order_number,
					(select name from currencies where id = txs.currency_id) as currency_name, 
					(select name from txs_types where id = txs.type) as type_name, 
					(select name from txs_statuses where id = txs.status) as status_name
					from txs 
					left join orders on orders.id = txs.order_id
					left join users on users.id = orders.client_id
					where orders.partner_id = ${partner_id}
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

	controller.statistics = async (req, res, next) => {
		async.parallel({
			statistics: (cb) => {
				connection.executeOne(`
					select count(id) as partners_total,
					(select count(distinct partner_id) from orders where partner_id = partners.id and DATE(created_at) > '${activity_date}') as partners_active,
				 	coalesce((select count(id) from orders where partner_id <> 0 limit 1), 0) as orders_count,
				 	coalesce((select sum(amount) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id <> 0 limit 1), 0) as orders_amount_rub,
				 	coalesce((select sum(amount) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id <> 0 limit 1), 0) as orders_amount_usd,
				 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id <> 0 limit 1), 0) as orders_amount_paid_rub,
				 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id <> 0 limit 1), 0) as orders_amount_paid_usd
					from partners limit 1`, { raw: true })
				.then((stats) => cb(null, stats))
				.catch((err) => cb(null, []));
			},
			topOrdersCount: (cb) => {
				connection.execute(`
					select partners.id, partners.name, partners.domain,
					if((select id from orders where partner_id = partners.id and DATE(created_at) > '${activity_date}' limit 1), 1, 0) as is_active,
				 	(select count(id) from orders where partner_id = partners.id limit 1) as orders_count,
				 	coalesce((select sum(amount) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id = partners.id limit 1), 0) as orders_amount_rub,
				 	coalesce((select sum(amount) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id = partners.id limit 1), 0) as orders_amount_usd,
				 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id = partners.id limit 1), 0) as orders_amount_paid_rub,
				 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id = partners.id limit 1), 0) as orders_amount_paid_usd
					from partners 
					having is_active is not null
					order by orders_count desc limit 5`, { raw: true })
				.then((stats) => cb(null, stats))
				.catch((err) => cb(null, []));
			},
			topOrdersAmount: (cb) => {
				connection.execute(`
					select partners.id, partners.name, partners.domain,
					if((select id from orders where partner_id = partners.id and DATE(created_at) > '${activity_date}' limit 1), 1, 0) as is_active,
				 	(select count(id) from orders where partner_id = partners.id limit 1) as orders_count,
				 	coalesce((select sum(amount) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id = partners.id limit 1), 0) as orders_amount_rub,
				 	coalesce((select sum(amount) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id = partners.id limit 1), 0) as orders_amount_usd,
				 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id = partners.id limit 1), 0) as orders_amount_paid_rub,
				 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id = partners.id limit 1), 0) as orders_amount_paid_usd
					from partners 
					having is_active is not null
					order by (orders_amount_paid_rub + orders_amount_paid_usd) desc limit 5`, { raw: true })
				.then((stats) => cb(null, stats))
				.catch((err) => cb(null, []));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	return controller;

};