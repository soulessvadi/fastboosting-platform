const Models = require('../models/schemas');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const async = require('async');
const connection = require('../models/sequelize');

module.exports = (db) => {

	const controller = {};

	controller.ticketUpdate = (req, res, next) => {
		let user_id = req.app.user.id;
		let system_number = req.params.number;
		Models.SupportTicket.findOne({where:{system_number:system_number}})
		.then(ticket => {
			if(!ticket) return res.status(202).json({'error':'ticket_not_found'});
			let data = {
				user_id: req.body.user_id || ticket.user_id,
				theme: req.body.theme || ticket.theme,
				description: req.body.description || ticket.description,
				status: req.body.status || ticket.status,
				pinned: !req.body.pinned || req.body.pinned == 'false' ? 0 : 1,
			};
			if(req.body.status == 4) data.considered_at = new Date();
			if(req.body.status == 3 && ticket.status != req.body.status) Models.Log.create({user_id: user_id, action_id: 21});
			else if(req.body.status == 4 && ticket.status != req.body.status) Models.Log.create({user_id: user_id, action_id: 20});
			else if(!!req.body.pinned && !!ticket.pinned != !!req.body.pinned) Models.Log.create({user_id: user_id, action_id: 19});
			else Models.Log.create({user_id: user_id, action_id: 18});
			ticket.update(data).then(results => {
				res.status(200).json({status:'ok',error:null});
			}).catch(err => res.status(202).json({status:'failed',error:'internal_error'}));
		}).catch(err => res.status(202).json({status:'failed',error:'internal_error'}));
		
	};

	controller.ticket = (req, res, next) => {
      	let system_number = req.params.number;
		async.parallel({
			ticket: (cb) => {
				let query = `select t.*, u.nick_name as author_name, u.id as author_id, ut.name as author_type,
				(select name from tickets_statuses where id = t.status limit 1) as status_name,
				if(t.order_id > 0, (select system_number from orders where id = t.order_id limit 1), null) as order_number,
				if(t.tx_id > 0, (select system_number from txs where id = t.tx_id limit 1), null) as tx_number
				from tickets t
				left join users u on u.id = t.user_id
				left join users_types ut on ut.id = u.type
				where t.system_number = '${system_number}'
				limit 1`;
				connection.executeOne(query, { raw: true }).then((ticket) => {
					cb(null, ticket);
				}).catch((err) => {
					cb(null, null);
				});
			},
			authors: (cb) => {
				connection.execute(`
					select users.id, users.nick_name, ut.name as type from users 
					left join users_types ut on ut.id = users.type
					where type in (3,4) order by users.nick_name`,{raw: true})
				.then((results) => {
					cb(null, results);
				}).catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.all = (req, res, next) => {
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 10;
      	let limits = page * perpage - perpage + ', ' + perpage;

		let sortfields = ['created_at','status','system_number','client_id'];
		let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
		let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
      	let user_type = parseInt(req.query.action || 4);
      	let user_id = parseInt(req.query.author || 0);
      	let status = parseInt(req.query.status || 0);
      	let type = parseInt(req.query.type || 0);
		let system_number = req.query.number || 0;
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;
		async.parallel({
			tickets: (cb) => {
		      	let conditions = '';
		      	if(system_number) conditions += ` and t.system_number = '${system_number}'`;
		      	if(type) conditions += ` and t.type = ${type}`;
		      	if(status) conditions += ` and t.status = ${status}`;
		      	if(user_id) conditions += ` and t.user_id = ${user_id}`;
				if(keyword) conditions += ` and (t.theme like '%${keyword}%' or t.description like '%${keyword}%' or t.id like '%${keyword}%' or t.system_number like '%${keyword}%' or u.nick_name like '%${keyword}%')`;
				let query = `select t.theme, t.description, t.system_number, t.created_at, t.considered_at, t.status, t.pinned,
				(select nick_name from users where id = t.user_id limit 1) as creator,
				(select name from tickets_statuses where id = t.status limit 1) as status_name,
				if(t.order_id > 0, (select system_number from orders where id = t.order_id limit 1), null) as order_number,
				if(t.tx_id > 0, (select system_number from txs where id = t.tx_id limit 1), null) as tx_number
				from tickets t
				left join users u on u.id = t.user_id
				where u.type = ${user_type}
				${conditions}
				order by t.pinned desc, t.${sortfield} ${sortdir}
				limit ${limits}`;
				connection.execute(query, { raw: true }).then((results) => {
					connection.executeOne(`
						select count(t.id) as total from tickets t 
						left join users u on u.id = t.user_id
						where u.type = ${user_type} limit 1`, {raw: true})
					.then(count => {
			            let pages = Math.ceil(count.total/perpage);
			            let pagination = utils.paginate(page, perpage, pages, 3);
						cb(null, {list: results, pagination: pagination});
					});
				}).catch((err) => {
					cb(null, {list: [], pagination: []});
				});
			},
			authors: (cb) => {
				connection.execute(`select id, nick_name from users where type = ${user_type} order by users.nick_name`,{raw: true})
				.then((results) => {
					cb(null, results);
				}).catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.statuses = (req, res, next) => {
		Models.SupportTicketStatus.findAll({ attributes: ['id','name'], raw: true}).then(statuses => {
			res.status(200).json(statuses);
		}).catch((err) => {
			res.status(202).json({status:'failed',error:'internal_error'});
		});
	};

	controller.types = (req, res, next) => {
		Models.SupportTicketType.findAll({ attributes: ['id','name'], raw: true}).then(types => {
			res.status(200).json(types);
		}).catch((err) => {
			res.status(202).json({status:'failed',error:'internal_error'});
		});
	};

	controller.self = (req, res, next) => {
		let user_id = req.app.user.id;
		let system_number = req.query.number || null;
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 10;
      	let limits = page * perpage - perpage + ', ' + perpage;
      	let number_query = system_number ? `and t.system_number = '${system_number}'` : ``;
		connection.execute(`
			select t.theme, t.description, t.system_number, t.created_at, t.considered_at, t.status, t.pinned,
			(select nick_name from users where id = t.user_id limit 1) as creator,
			(select name from tickets_statuses where id = t.status limit 1) as status_name,
			if(t.order_id > 0, (select system_number from orders where id = t.order_id limit 1), null) as order_number,
			if(t.tx_id > 0, (select system_number from txs where id = t.tx_id limit 1), null) as tx_number,
			(select user_name from chat_messages where room = t.system_number and user_id <> t.user_id order by id desc limit 1) as message_author,
			(select created_at from chat_messages where room = t.system_number and user_id <> t.user_id order by id desc limit 1) as message_date
			from tickets t
			where t.user_id = ?
			${number_query}
			order by t.created_at desc
			limit ${limits}
		  	`, 
		{ replacements: [user_id], raw: true })
		.then((results) => {
			Models.SupportTicket.count({ where: { user_id: user_id }}).then(total => {
	            let pages = Math.ceil(total/perpage);
	            let pagination = utils.paginate(page, perpage, pages, 3);
				res.status(200).json({tickets: results, pagination: pagination});
			});
		})
		.catch((err) => {
			res.status(202).json({status:'failed',error:'internal_error'});
		});
	};

	controller.new = (req, res, next) => {
		let entity = {
			order_number: req.body.order_number.trim(),
			tx_number: req.body.tx_number.trim(),
			user_id: req.app.user.id,
			theme: req.body.theme,
			description: req.body.description,
			order_id: 0,
			tx_id: 0,
		};

		(async () => {
			if(entity.order_number && entity.order_number.length > 5) {
				try	{
					let order =  await Models.Order.findOne({where:{system_number:entity.order_number}, raw:true});
					entity.order_id = order.id;
				} catch(e) {
					entity.order_id = 0;
				}
			} else if(entity.tx_number && entity.tx_number.length > 5) {
				try	{
					let tx =  await Models.Tx.findOne({where:{system_number:entity.tx_number}, raw:true});
					entity.tx_id = tx.id;
				} catch(e) {
					entity.tx_id = 0;
				}
			}
	      	Models.SupportTicket.create(entity).then((ticket) => {
				ticket.update({system_number:ticket.id});
				res.status(200).json(ticket);
			}).catch((err) => {
				res.status(202).json({status:'failed',error:'internal_error'});
			});
		})();

	};	

	return controller;
};