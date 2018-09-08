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
	
	controller.create = (req, res, next) => {
		if(!req.body.amount || !req.body.user_id || !req.body.type) {
			res.status(202).json({'error':'bad_parameters'});
			return null;
		}
		var mock = Models.Tx.build();
		mock.system_number = req.body.user_id;
		mock.amount = Math.abs(req.body.amount || mock.amount);
		mock.user_id = (req.body.user_id || mock.user_id);
		mock.order_id = (req.body.order_id || mock.order_id);
		mock.currency_id = (req.body.currency_id || mock.currency_id);
		mock.type = (req.body.type || mock.type);
		mock.status = (req.body.status || mock.status);
		mock.comment = (req.body.comment || mock.comment);
		if(mock.type == 2 || mock.type == 4) mock.amount = 0 - mock.amount;
		mock.save().then((tx) => {
			connection.executeOne(`
				select txs.id, txs.system_number, txs.currency_id, txs.created_at, txs.status, txs.comment,
				txs.type, txs.user_id, users.nick_name as user_name, cast(txs.amount AS decimal(19,2)) as amount,
				orders.system_number as order_number, 
				(select name from currencies where id = txs.currency_id) as currency_name, 
				(select name from txs_types where id = txs.type) as type_name, 
				(select name from txs_statuses where id = txs.status) as status_name
				from txs 
				left join users on users.id = txs.user_id
				left join orders on orders.id = txs.order_id
				where txs.id = ${tx.id} limit 1`, { raw: true })
			.then((tx) => res.status(200).json(tx))
			.catch((err) => res.status(202).json({'error':'internal_error'}));
		}).catch((err) => {console.log(err), res.status(202).json({'error':'validation_error'})});
	};

	controller.remove = (req, res, next) => {
		if(req.params.id) {
			Models.Tx.findById(req.params.id).then((tx) => {
				tx.destroy().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'tx_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.update = (req, res, next) => {
		if(req.params.id) {
			Models.Tx.findById(req.body.id).then((tx) => {
				let data = { 
					comment: (req.body.comment || tx.comment),
					client_id: parseInt(req.body.client_id || tx.client_id),
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
		let tx_id = parseInt(req.params.id);
		async.parallel({
			txs: (cb) => {
				if(!tx_id) return cb(null, []);
				connection.executeOne(`
					select txs.id, txs.system_number, txs.currency_id, txs.created_at, txs.status, txs.comment,
					txs.type, txs.user_id, users.nick_name as user_name, cast(txs.amount AS decimal(19,2)) as amount,
					orders.system_number as order_number, 
					(select name from currencies where id = txs.currency_id) as currency_name, 
					(select name from txs_types where id = txs.type) as type_name, 
					(select name from txs_statuses where id = txs.status) as status_name
					from txs 
					left join users on users.id = txs.user_id
					left join orders on orders.id = txs.order_id
					where txs.id = ${tx_id} limit 1`, { raw: true })
				.then((txs) => {
			    	cb(null, txs);
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			},
			users: (cb) => {
				connection.execute(`
					select users.id, users.nick_name, users.currency_id, ut.name as type_name
					from users 
					left join users_types ut on ut.id = users.type
					where users.is_blocked = 0 and users.type in (3,4)
					order by ut.id asc, users.nick_name asc`, {raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
			},
			orders: (cb) => {
				Models.Order.findAll({order:[['id','desc']],limit:50,attributes:['id','system_number'],raw:true})
				.then((results) => cb(null, results))
				.catch((err) => cb(null, []));
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