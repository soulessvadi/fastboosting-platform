const Models = require('../models/schemas');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const storage = require('../utils/storage');
const connection = require('../models/sequelize');
const Op = connection.Sequelize.Op;

module.exports = (db) => {

	const controller = {};

	controller.removeScreenshot = (req, res, next) => {
		if(req.params.src) {
			Models.OrderReportScreenshot.findOne({where:{filename:req.params.src}}).then((scr) => {
				scr.destroy().then(() => {
					if(!fs.existsSync(storage.spaces.reports + scr)) {
						fs.unlink(storage.spaces.reports + scr, (err, res) => null);
					}
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(200).json({'status':'ok'}));
			}).catch((err) => res.status(202).json({'error':'image_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.removeReport = (req, res, next) => {
		if(req.params.id) {
			Models.OrderReport.findById(req.params.id).then((report) => {
				report.destroy().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'partner_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.updateReport = (req, res, next) => {
		if(req.params.id) {
			Models.OrderReport.findById(req.params.id).then((report) => {
				let data = { 
					comment: (req.body.comment || report.comment),
					games: (req.body.games || report.games),
					hours: (req.body.hours || report.hours),
					mmr: (req.body.mmr || report.mmr),
					medal: (req.body.medal || report.medal),
					result: (req.body.result || report.result),
					finisher: (req.body.finisher || report.finisher),
				};
				report.update(data).then(() => {
					let files = [];
					Models.Order.findById(report.order_id).then(order => {
						if(order) {
							order.mmr_boosted = parseInt(report.mmr - order.mmr_start); 
							order.cali_games_done = parseInt(order.cali_games_done + report.games); 
							order.medal_current = report.medal;
							order.training_hours_done = parseInt(order.training_hours_done + report.hours);		
							order.save();					
						}
					})
					if(typeof req.files != typeof undefined) {
						req.files.forEach(f => {
							files.push(f.filename);
							Models.OrderReportScreenshot.create({ report_id: report.id, filename: f.filename });
						});
					}					
		    		res.status(200).json({'status':'ok','files':files});
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'report_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.reports = (req, res, next) => {
		async.parallel({
			reports: (cb) => {
		      	let page = req.query.page || 1;
				let perpage = req.query.perpage || 15;
		      	let limits = page * perpage - perpage + ', ' + perpage;
				let sortfields = ['id', 'created_at', 'order_id', 'user_id','finisher'];
				let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
				let sortfield = sortfields.includes(req.query.sort) ? 'rep.' + req.query.sort : 'rep.' + sortfields[0];
				let finisher = req.query.finisher || 0;
				let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;    
				let conditions = ``;
				if(keyword) conditions += ` and (orders.system_number like '%${keyword}%' or rep.id like '${keyword}%' or rep.comment like '%${keyword}%' or rep.user_id like '${keyword}%' or users.nick_name like '%${keyword}%')`; 
				if(finisher) conditions += ` and rep.finisher = 1`; 
				connection.execute(`
					select rep.id, rep.comment, rep.games, rep.hours, rep.mmr, rep.medal, rep.result, rep.finisher, 
					rep.user_id, users.nick_name as creator, rep.created_at, users.nick_name as user_name,
					orders.system_number as order_number, orders.type as order_type,
					(select name from orders_types where id = orders.type limit 1) as order_type_name,
					(select GROUP_CONCAT(filename SEPARATOR '|') from orders_reports_screenshots where report_id = rep.id) as files
					from orders_reports rep 
					left join users on users.id = rep.user_id
					left join orders on orders.id = rep.order_id
					where 1 ${conditions}
					order by ${sortfield} ${sortdir} limit ${limits}`, { raw: true })
				.then((reports) => {
					let results = { list: reports };
					connection.executeOne(`
						select count(rep.id) as total 
						from orders_reports rep 
						left join users on users.id = rep.user_id
						left join orders on orders.id = rep.order_id
						where 1 ${conditions} limit 1`, {raw: true})
					.then(count => {
			            let pages = Math.ceil(count.total/perpage);
			            results.total = count.total;
			            results.pagination = utils.paginate(page, perpage, pages, 3);
				    	cb(null, results);
					}).catch((err) => res.status(202).json({'error':'internal_error'}));
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}
		}, (err, results) => {
			res.status(200).json(results);
		});
	};

	controller.orderCreate = (req, res, next) => {
		let user_id = req.app.user.id;
		let order = Models.Order.build();
		order.system_number = user_id;
		order.client_id = req.body.client_id || order.client_id;
		order.worker_id = req.body.worker_id || order.worker_id;
		order.status = req.body.status || order.status;
		order.type = req.body.type || order.type;
		order.type = req.body.type || order.type;
		order.account_login = req.body.account_login || order.account_login;
		order.account_pass = req.body.account_pass || order.account_pass;
		order.amount = req.body.amount || order.amount;
		order.amount_paid = req.body.amount_paid || order.amount_paid;
		order.cali_games_total = req.body.cali_games_total || order.cali_games_total;
		order.cali_type = req.body.cali_type || order.cali_type;
		order.client_comment = req.body.client_comment || order.client_comment;
		order.currency_id = req.body.currency_id || order.currency_id;
		order.deadline = req.body.deadline || order.deadline;
		order.dotabuff = req.body.dotabuff || order.dotabuff;
		order.heroes = req.body.heroes || order.heroes;
		order.heroes_ban = req.body.heroes_ban || order.heroes_ban;
		order.lanes = req.body.lanes || order.lanes;
		order.medal_finish = req.body.medal_finish || order.medal_finish;
		order.medal_start = req.body.medal_start || order.medal_start;
		order.mmr_finish = req.body.mmr_finish || order.mmr_finish;
		order.mmr_start = req.body.mmr_start || order.mmr_start;
		order.partner_id = req.body.partner_id || order.partner_id;
		order.quality = req.body.quality || order.quality;
		order.salary_rub = req.body.salary_rub || order.salary_rub;
		order.salary_usd = req.body.salary_usd || order.salary_usd;
		order.servers = req.body.servers || order.servers;
		order.training_hours = req.body.training_hours || order.training_hours;
		order.training_services = req.body.training_services || order.training_services;
		order.training_time_from = req.body.training_time_from || order.training_time_from;
		order.training_time_till = req.body.training_time_till || order.training_time_till;
		order.training_worker_id = req.body.training_worker_id || order.training_worker_id;
		order.save(data)
		.then(results => {
			Models.Log.create({user_id: user_id, action_id: 22, order_id: order.id});
			res.status(200).json(results.system_number);
		})
		.catch(err => res.status(202).json({'error':'internal_error'}));
	};

	controller.orderUpdate = (req, res, next) => {
		let user_id = req.app.user.id;
		let system_number = req.params.number;
		Models.Order.findOne({where:{system_number:system_number}})
		.then(order => {
			if(!order) return res.status(202).json({'error':'order_not_found'});
			let data = {
				client_id: req.body.client_id || order.client_id,
				worker_id: req.body.worker_id || order.worker_id,
				status: req.body.status || order.status,
				type: req.body.type || order.type,
				type: req.body.type || order.type,
				account_login: req.body.account_login || order.account_login,
				account_pass: req.body.account_pass || order.account_pass,
				amount: req.body.amount || order.amount,
				amount_paid: req.body.amount_paid || order.amount_paid,
				cali_games_total: req.body.cali_games_total || order.cali_games_total,
				cali_type: req.body.cali_type || order.cali_type,
				client_comment: req.body.client_comment || order.client_comment,
				currency_id: req.body.currency_id || order.currency_id,
				deadline: req.body.deadline || order.deadline,
				dotabuff: req.body.dotabuff || order.dotabuff,
				heroes: req.body.heroes || order.heroes,
				heroes_ban: req.body.heroes_ban || order.heroes_ban,
				lanes: req.body.lanes || order.lanes,
				medal_finish: req.body.medal_finish || order.medal_finish,
				medal_start: req.body.medal_start || order.medal_start,
				mmr_finish: req.body.mmr_finish || order.mmr_finish,
				mmr_start: req.body.mmr_start || order.mmr_start,
				partner_id: req.body.partner_id || order.partner_id,
				quality: req.body.quality || order.quality,
				salary_rub: req.body.salary_rub || order.salary_rub,
				salary_usd: req.body.salary_usd || order.salary_usd,
				servers: req.body.servers || order.servers,
				training_hours: req.body.training_hours || order.training_hours,
				training_services: req.body.training_services || order.training_services,
				training_time_from: req.body.training_time_from || order.training_time_from,
				training_time_till: req.body.training_time_till || order.training_time_till,
				training_worker_id: req.body.training_worker_id || order.training_worker_id,
			};
			if(req.body.status == 10 && order.status != req.body.status) Models.Log.create({user_id: user_id, action_id: 23, order_id: order.id});
			else if(req.body.worker_id != order.worker_id && order.worker_id == 0) Models.Log.create({user_id: user_id, action_id: 24, order_id: order.id});
			else if(req.body.worker_id != order.worker_id) Models.Log.create({user_id: user_id, action_id: 25, order_id: order.id});
			else Models.Log.create({user_id: user_id, action_id: 22, order_id: order.id});
			order.update(data).then(results => {
				res.status(200).json({status:'ok',error:null});
			}).catch(err => res.status(202).json({status:'failed',error:'internal_error'}));
		}).catch(err => res.status(202).json({status:'failed',error:'internal_error'}));
	};

	controller.order = (req, res, next) => {
		let user_id = req.app.user.id;
		let system_number = req.params.number;
		async.parallel({
			order: (cb) => {
				connection.executeOne(
					`select o.*, c.name as currency_name, c.sign as currency_sign,
				  	(select created_at from orders_histories where order_id = o.id and worker_id = o.worker_id and action = 1 limit 1) as joined_at,
				  	(select name from orders_statuses where id = o.status limit 1) as status_name
				  	from orders o
				  	left join users as u on u.id = o.worker_id
				  	left join currencies as c on c.id = o.currency_id
				  	left join users_pricelists_categories as upc on upc.id = u.rating_id
				  	where o.system_number = '${system_number}'
				  	limit 1`, 
			  	{replacements: [user_id], raw: true})
				.then((results) => {
					(async () => {
						if(!results) throw res.status(202).json({"error":"order_not_found"});
						results.servers = JSON.parse(results.servers);
						results.lanes = JSON.parse(results.lanes);
						results.heroes = JSON.parse(results.heroes);
						results.heroes_ban = JSON.parse(results.heroes_ban);
						results.training_services = JSON.parse(results.training_services);
						try {
						    results.logs = await connection.execute(
							`select logs.message, logs.additional, logs.created_at, la.name as act, users.nick_name as creator, la.details
							from logs
							left join logs_actions la on la.id = logs.action_id
							left join users on users.id = logs.user_id
						  	where logs.order_id = ? order by logs.id desc limit 50`, 
					  		{replacements: [results.id], raw: true});
						} catch(e) {
							results.logs = [];
						}
						try {
						    results.reports = await connection.execute(
							`select rep.id, rep.comment, rep.games, rep.hours, rep.mmr, rep.medal, rep.result, rep.finisher, users.nick_name as creator, rep.created_at
							from orders_reports rep
							left join users on users.id = rep.user_id
						  	where rep.order_id = ? order by rep.id desc limit 50`, 
					  		{replacements: [results.id], raw: true});
						} catch(e) {
							results.reports = e;
						}						
						cb(null, results);
					})();
				})
				.catch(err => {
					res.status(202).json({'error':'internal_error'});
				});
			},
			partners: (cb) => {
				Models.Partner.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			users: (cb) => {
				connection.execute(`
					select users.id, users.nick_name, users.type, ut.name as type_name from users 
					left join users_types ut on ut.id = users.type
					where type in (3,4) order by users.nick_name`,{raw: true})
				.then((results) => {
					cb(null, results);
				}).catch((err) => {
					cb(null, []);
				})
			},
			statuses: (cb) => {
				Models.OrderStatus.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			types: (cb) => {
				Models.OrderType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			cali: (cb) => {
				Models.OrderCalibrationType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			ranks: (cb) => {
				Models.BoosterPricelistMedal.findAll({raw: true, attributes: ['id', 'title', 'rank', 'image']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			services: (cb) => {
				Models.BoosterTrainingService.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.all = (req, res, next) => {
		async.parallel({
			orders: (cb) => {
				let sortfields = ['created_at','deadline','status','type','system_number','client_id','partner_id','amount','salary_run'];
				let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
				let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
				let type = req.query.type ? parseInt(req.query.type) : 0;
				let status = req.query.status ? parseInt(req.query.status) : 0;
				let client = req.query.client ? parseInt(req.query.client) : 0;
				let booster = req.query.booster ? parseInt(req.query.booster) : 0;
				let partner = req.query.partner ? parseInt(req.query.partner) : 0;
				let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;
				let conditions = ``;
				if(type) conditions += ` and o.type = ${type}`;
				if(status) conditions += ` and o.status = ${status}`;
				if(client) conditions += ` and o.client_id = ${client}`;
				if(booster) conditions += ` and o.worker_id = ${booster}`;
				if(partner) conditions += ` and o.partner_id = ${partner}`;
				if(keyword) conditions += ` and (o.id like '%${keyword}%' or o.system_number like '%${keyword}%' or u.nick_name like '%${keyword}%' or p.name like '%${keyword}%' )`;
				let query = `
				  	select o.type,o.client_comment,o.quality,o.lanes,o.heroes,o.heroes_ban,o.servers,o.mmr_start,o.mmr_finish,o.mmr_boosted,
				  	o.medal_start,o.medal_finish,o.medal_current,o.cali_games_done,o.training_time_from,o.training_time_till,o.training_hours,
				  	o.training_services,o.training_hours_done,o.training_worker_id,o.status,o.urgency_hours,o.system_number,o.created_at, o.deadline,
				  	o.amount, o.amount_paid, o.salary_rub, o.salary_usd, o.worker_id, o.client_id, c.name as currency_name, c.sign as currency_sign,
				  	p.name as partner_name, p.domain as partner_domain, o.partner_id, u.nick_name as client_name,
				  	(select nick_name from users where id = o.worker_id) as worker_name,
				  	(select name from orders_statuses where id = o.status) as status_name
				  	from orders o
				  	left join users u on u.id = o.client_id
				  	left join partners p on p.id = o.partner_id
				  	left join currencies c on c.id = o.currency_id
					where o.status < 9
					${conditions}
					order by o.${sortfield} ${sortdir}`;
				connection.execute(query, { raw: true })
				.then((results) => {
					results.forEach((e) => {
						e.lanes = JSON.parse(e.lanes);
						e.heroes = JSON.parse(e.heroes);
						e.heroes_ban = JSON.parse(e.heroes_ban);
						e.servers = JSON.parse(e.servers);
						e.training_services = JSON.parse(e.training_services);
					});
					cb(null, results);
				})
				.catch((err) => {
					res.status(202).json({'error':'internal_error'});
				});
			},
			clients: (cb) => {
				Models.User.findAll({raw: true, attributes: ['id', 'nick_name'], where: { type: 4 }})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			boosters: (cb) => {
				Models.User.findAll({raw: true, attributes: ['id', 'nick_name'], where: { type: 3 }})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			statuses: (cb) => {
				Models.OrderStatus.findAll({raw: true, attributes: ['id', 'name'], where:{id:{[Op.lt]:9}} })
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			partners: (cb) => {
				Models.Partner.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			types: (cb) => {
				Models.OrderType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			lanes: (cb) => {
				Models.Lane.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			servers: (cb) => {
				Models.OrderServer.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			ranks: (cb) => {
				Models.BoosterPricelistMedal.findAll({raw: true, attributes: ['id', 'title', 'rank', 'image']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			services: (cb) => {
				Models.BoosterTrainingService.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.problematic = (req, res, next) => {
		async.parallel({
			orders: (cb) => {
				let sortfields = ['created_at','deadline','status','type','system_number','client_id','partner_id','amount','salary_run'];
				let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
				let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
				let type = req.query.type ? parseInt(req.query.type) : 0;
				let status = req.query.status ? parseInt(req.query.status) : 0;
				let client = req.query.client ? parseInt(req.query.client) : 0;
				let booster = req.query.booster ? parseInt(req.query.booster) : 0;
				let partner = req.query.partner ? parseInt(req.query.partner) : 0;
				let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;
				let conditions = ``;
				if(type) conditions += ` and o.type = ${type}`;
				if(status) conditions += ` and o.status = ${status}`;
				if(client) conditions += ` and o.client_id = ${client}`;
				if(booster) conditions += ` and o.worker_id = ${booster}`;
				if(partner) conditions += ` and o.partner_id = ${partner}`;
				if(keyword) conditions += ` and (o.id like '%${keyword}%' or o.system_number like '%${keyword}%' or u.nick_name like '%${keyword}%' or p.name like '%${keyword}%' )`;
				let query = `
				  	select o.type,o.client_comment,o.quality,o.lanes,o.heroes,o.heroes_ban,o.servers,o.mmr_start,o.mmr_finish,o.mmr_boosted,
				  	o.medal_start,o.medal_finish,o.medal_current,o.cali_games_done,o.training_time_from,o.training_time_till,o.training_hours,
				  	o.training_services,o.training_hours_done,o.training_worker_id,o.status,o.urgency_hours,o.system_number,o.created_at,
				  	o.amount, o.amount_paid, o.salary_rub, o.salary_usd, o.worker_id, o.client_id, c.name as currency_name, c.sign as currency_sign,
				  	p.name as partner_name, p.domain as partner_domain, o.partner_id, u.nick_name as client_name,
				  	(select nick_name from users where id = o.worker_id) as worker_name,
				  	(select name from orders_statuses where id = o.status) as status_name,
				  	(select system_number from tickets where order_id = o.id) as ticket_number
				  	from orders o
				  	left join users u on u.id = o.client_id
				  	left join partners p on p.id = o.partner_id
				  	left join currencies c on c.id = o.currency_id
					where o.status > 8
					${conditions}
					order by o.${sortfield} ${sortdir}`;
				connection.execute(query, { raw: true })
				.then((results) => {
					results.forEach((e) => {
						e.lanes = JSON.parse(e.lanes);
						e.heroes = JSON.parse(e.heroes);
						e.heroes_ban = JSON.parse(e.heroes_ban);
						e.servers = JSON.parse(e.servers);
						e.training_services = JSON.parse(e.training_services);
					});
					cb(null, results);
				})
				.catch((err) => {
					res.status(202).json({'error':'internal_error'});
				});
			},
			clients: (cb) => {
				Models.User.findAll({raw: true, attributes: ['id', 'nick_name'], where: { type: 4 }})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			boosters: (cb) => {
				Models.User.findAll({raw: true, attributes: ['id', 'nick_name'], where: { type: 3 }})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			statuses: (cb) => {
				Models.OrderStatus.findAll({raw: true, attributes: ['id', 'name'], where:{id:{[Op.gt]:8}} })
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			partners: (cb) => {
				Models.Partner.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			types: (cb) => {
				Models.OrderType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			lanes: (cb) => {
				Models.Lane.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			servers: (cb) => {
				Models.OrderServer.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			ranks: (cb) => {
				Models.BoosterPricelistMedal.findAll({raw: true, attributes: ['id', 'title', 'rank', 'image']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			services: (cb) => {
				Models.BoosterTrainingService.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.accessible = (req, res, next) => {
		let user = req.app.user;
		let permissions = user.order_permissions;
		async.parallel({
			orders: (cb) => {
				connection.execute(`
				  	select o.type,o.client_comment,o.quality,o.lanes,o.heroes,o.heroes_ban,o.servers,o.mmr_start,o.mmr_finish,o.mmr_boosted,
				  	o.medal_start,o.medal_finish,o.medal_current,o.cali_games_done,o.training_time_from,o.training_time_till,o.training_hours,
				  	o.training_services,o.training_hours_done,o.training_worker_id,o.status,o.urgency_hours,o.system_number,o.created_at, o.deadline,
				  	if(u.currency_id = 1, o.salary_rub * upc.factor, o.salary_usd * upc.factor) as amount
				  	from orders o
				  	left join users as u on u.id = ?
				  	left join currencies as c on c.id = u.currency_id
				  	left join users_pricelists_categories as upc on upc.from <= u.rating and upc.till >= u.rating
				  	where o.medal_finish <= ${permissions.medal_finish}
					and o.mmr_finish <= ${permissions.mmr_finish}
					and o.type in (${permissions.type.join(',')})
					and o.partner_id in (${permissions.source_id.join(',')})
					and o.status = 5
					group by o.id
					order by o.created_at`, { replacements: [user.id], raw: true })
				.then((results) => {
					results.forEach((e) => {
						e.lanes = JSON.parse(e.lanes);
						e.heroes = JSON.parse(e.heroes);
						e.heroes_ban = JSON.parse(e.heroes_ban);
						e.servers = JSON.parse(e.servers);
						e.training_services = JSON.parse(e.training_services);
					});
					cb(null, results);
				})
				.catch((err) => {
					res.status(202).json({'error':'internal_error'});
				});
			},
			types: (cb) => {
				Models.OrderType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			lanes: (cb) => {
				Models.Lane.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			servers: (cb) => {
				Models.OrderServer.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			ranks: (cb) => {
				Models.BoosterPricelistMedal.findAll({raw: true, attributes: ['id', 'title', 'rank', 'image']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			services: (cb) => {
				Models.BoosterTrainingService.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.history = (req, res, next) => {
		async.parallel({
			orders: (cb) => {
				connection.execute(
					`select o.type,o.client_comment,o.quality,o.lanes,o.heroes,o.heroes_ban,o.servers,o.mmr_start,o.mmr_finish,o.mmr_boosted,
				  	o.medal_start,o.medal_finish,o.medal_current,o.cali_games_done, o.training_time_from,o.training_time_till,o.training_hours,
				  	o.training_services,o.training_hours_done,o.training_worker_id,o.status,o.urgency_hours,o.system_number,o.created_at,
				  	oh.note as history_note, oh.rank as rank, oh.worker_rank as worker_rank, oh.salary as amount, oh.created_at as left_at,  
				  	(select created_at from orders_histories where order_id = o.id and worker_id = oh.worker_id and action = 1 limit 1) as joined_at,
				  	(select name from orders_statuses where id = o.status limit 1) as status_name
				  	from orders o
				  	left join orders_histories oh on oh.order_id = o.id
				  	where oh.worker_id = ? and oh.action = 2
				  	order by oh.created_at`, 
			  	{replacements: [req.app.user.id], raw: true})
				.then((results) => {
					results.forEach((e) => {
						e.servers = JSON.parse(e.servers);
						e.lanes = JSON.parse(e.lanes);
						e.heroes = JSON.parse(e.heroes);
						e.heroes_ban = JSON.parse(e.heroes_ban);
						e.training_services = JSON.parse(e.training_services);
					});
					cb(null, results);
				})
				.catch((err) => {
					res.status(500).json({'error':'internal_error'});
				});
			},
			types: (cb) => {
				Models.OrderType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			lanes: (cb) => {
				Models.Lane.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			servers: (cb) => {
				Models.OrderServer.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			ranks: (cb) => {
				Models.BoosterPricelistMedal.findAll({raw: true, attributes: ['id', 'title', 'rank', 'image']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			services: (cb) => {
				Models.BoosterTrainingService.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};

	controller.active = (req, res, next) => {
		let user_id = req.app.user.id;
		async.parallel({
			order: (cb) => {
				connection.executeOne(
					`select o.id, o.type,o.client_comment,o.quality,o.lanes,o.heroes,o.heroes_ban,o.servers,o.mmr_start,o.mmr_finish,o.mmr_boosted,
				  	o.training_services,o.training_hours_done,o.training_worker_id,o.status,o.urgency_hours,o.system_number,o.created_at,
				  	o.medal_start,o.medal_finish,o.medal_current,o.cali_games_done,o.cali_games_total,o.training_time_from,o.training_time_till,o.training_hours,
				  	o.deadline,o.dotabuff,o.account_login,o.account_pass,o.worker_status,
				  	(select created_at from orders_histories where order_id = o.id and worker_id = o.worker_id and action = 1 limit 1) as joined_at,
				  	(select name from orders_calibration_types where id = o.cali_type limit 1) as cali_type,
				  	(select name from orders_statuses where id = o.status limit 1) as status_name,
			  		if(u.currency_id = 1, o.salary_rub * upc.factor, o.salary_usd * upc.factor) as amount, 
			  		c.name as currency_name, c.sign as currency_sign
				  	from orders o
				  	left join users as u on u.id = o.worker_id
				  	left join currencies as c on c.id = u.currency_id
				  	left join users_pricelists_categories as upc on upc.from <= u.rating and upc.till >= u.rating
				  	where o.worker_id = ? and o.status in (6,9)
				  	limit 1`, 
			  	{replacements: [user_id], raw: true})
				.then((results) => {
					(async () => {
						if(!results) throw res.status(202).json({"error":"no_active_order_reference"});
						results.servers = JSON.parse(results.servers);
						results.lanes = JSON.parse(results.lanes);
						results.heroes = JSON.parse(results.heroes);
						results.heroes_ban = JSON.parse(results.heroes_ban);
						results.training_services = JSON.parse(results.training_services);
						try {
						    results.logs = await connection.execute(
							`select logs.message, logs.additional, logs.created_at, la.name as act, users.nick_name as creator, la.details
							from logs
							left join logs_actions la on la.id = logs.action_id
							left join users on users.id = logs.user_id
						  	where logs.order_id = ? and logs.user_id = ? order by logs.id desc limit 15`, 
					  		{replacements: [results.id, user_id], raw: true});
						} catch(e) {
							results.logs = [];
						}
						try {
						    results.reports = await connection.execute(
							`select rep.id, rep.comment, rep.games, rep.hours, rep.mmr, rep.medal, rep.result, rep.finisher, users.nick_name as creator, rep.created_at
							from orders_reports rep
							left join users on users.id = rep.user_id
						  	where rep.order_id = ? and rep.user_id = ? order by rep.id desc limit 15`, 
					  		{replacements: [results.id, user_id], raw: true});
						} catch(e) {
							results.reports = e;
						}						
						cb(null, results);
					})();
				})
				.catch(err => {
					res.status(202).json({'error':'internal_error'});
				});
			},
			types: (cb) => {
				Models.OrderType.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			lanes: (cb) => {
				Models.Lane.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			servers: (cb) => {
				Models.OrderServer.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			ranks: (cb) => {
				Models.BoosterPricelistMedal.findAll({raw: true, attributes: ['id', 'title', 'rank', 'image']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			},
			services: (cb) => {
				Models.BoosterTrainingService.findAll({raw: true, attributes: ['id', 'name']})
				.then((results) => {
					cb(null, results);
				})
				.catch((err) => {
					cb(null, []);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};	

	controller.issue = (req, res, next) => {
		if(	!req.body.text ) {
			return res.status(202).json({'error':'bad_parameters'});
		}

		let user_id = req.app.user.id;
		Models.Order.findOne({where:{ worker_id:user_id, status:6 }})
		.then(order => {
			if(order) {
				order.update({status: 9}).then(() => {});
				Models.SupportTicket.create({
					order_id: order.id,
					user_id: user_id,
					theme: req.body.text,
					description: req.body.message,
				})
				.then((ticket) => {
					Models.Log.create({ user_id: user_id, order_id: order.id, action_id: 12 });
					ticket.system_number = ticket.id;
					ticket.save().then(issue => {
			    		res.status(200).json(issue);
					});
			    })
			} else {
				res.status(202).json({'error':'operation_not_allowed'});
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});

	};

	controller.workerStatus = (req, res, next) => {
		let user_id = req.app.user.id;
		Models.Order.findOne({where:{ worker_id:user_id, status:[6,9] }})
		.then(order => {
			if(order) {
				order.update({worker_status: req.body.status}).then(() => {
					res.status(200).json(req.body.status);
				});
			} else {
				res.status(202).json({'error':'operation_not_allowed'});
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});

	};

	controller.setDotabuff = (req, res, next) => {
		let user_id = req.app.user.id;
		Models.Order.findOne({where:{ worker_id:user_id, status:[6,9] }})
		.then(order => {
			if(order) {
				order.update({dotabuff: req.body.link}).then(() => {
					Models.Log.create({ user_id: user_id, order_id: order.id, action_id: 10 });
					res.status(200).json(req.body.link);
				});
			} else {
				res.status(202).json({'error':'operation_not_allowed'});
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});

	};

	controller.cancelOrder = (req, res, next) => {
		let user_id = req.app.user.id;
		let user_rank = req.app.user.rating;
		Models.Order.findOne({where:{ worker_id:user_id, status:[6,9] }})
		.then(order => {
			if(order) {
				order.update({worker_id: 0, status: 5,updated_at: new Date}).then(() => {
					Models.Log.create({ user_id: user_id, order_id: order.id, action_id: 8 });
					Models.OrderHistory.create({ action: 2, order_id: order.id, worker_id: user_id, worker_rank: user_rank, rank: 0, note: 'Заказ отменен' });
					res.status(200).json('order_canceled');
				}).catch(e => console.log(e) );
			} else {
				res.status(202).json({'error':'operation_not_allowed'});
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});

	};

	controller.joinOrder = (req, res, next) => {
		let user_id = req.app.user.id;
		let user_rank = req.app.user.rating;
		let order_id = req.body.id;
		Models.Order.findOne({ where:{ 
			system_number: order_id, worker_id: 0, status: 5,
			medal_finish: {[Op.lte] : req.app.user.order_permissions.medal_finish},
			mmr_finish: {[Op.lte] : req.app.user.order_permissions.mmr_finish},
			type: {[Op.in] : req.app.user.order_permissions.type},
			partner_id: {[Op.in] : req.app.user.order_permissions.source_id},
		}})
		.then(order => {
			if(order) {
				if(!order.deadline) order.deadline = new Date().addHours(order.urgency_hours);
				order.worker_id = user_id;
				order.status = 6;
				order.updated_at = new Date;
				order.save().then(() => {
					Models.Log.create({ user_id: user_id, order_id: order.id, action_id: 7 });
					Models.OrderHistory.create({ action: 1, order_id: order.id, worker_id: user_id, worker_rank: user_rank, rank: 0, note: 'Бустер присоеденился к заказу' });
					res.status(200).json('order_joined');
				}).catch(e => res.status(202).json({'error':'internal_error'}));
			} else {
				res.status(202).json({'error':'order_not_available'});
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});

	};

	controller.report = (req, res, next) => {
		let user_id = req.app.user.id;
		let response = {};
		if(	!req.body.mmr ) {
			return res.status(202).json({'error':'bad_parameters'});
		}
		Models.Order.findOne({where:{ worker_id: user_id}}).then(order => {
			if(order) {
				Models.OrderReport.create({
					order_id: order.id,
					user_id: user_id,
					comment: req.body.comment,
					mmr_diff: req.body.mmr - (order.mmr_start + order.mmr_boosted),
					mmr: parseInt(req.body.mmr || (order.mmr_start + order.mmr_boosted)),
					games: parseInt(req.body.games || order.cali_games_done),
					hours: parseInt(req.body.hours || order.training_hours_done),
					medal: parseInt(req.body.medal || order.medal_current),
					finisher: req.body.finisher,
				}).then(report => {
					order.update({ 
						mmr_boosted: parseInt(report.mmr - order.mmr_start), 
						cali_games_done: parseInt(order.cali_games_done + report.games), 
						medal_current: report.medal,
						training_hours_done: parseInt(order.training_hours_done + report.hours),
					});
					(async () => {
						response.report = {
							id: report.id,
							comment: report.comment,
							created_at: report.created_at,
							mmr: report.mmr,
							result: report.result,
							games: report.games,
							hours: report.hours,
							medal: report.medal,
							finisher: report.finisher,
							screenshots: [],
							creator: req.app.user.nick_name,
						};
						if(typeof req.files != typeof undefined) {
							response.report.screenshots = req.files.map(f => f.filename);
							req.files.forEach(f => {
								Models.OrderReportScreenshot.create({
									report_id: report.id,
									filename: f.filename
								});
							});
						}
						let log = await Models.Log.create({ user_id: user_id, order_id: order.id, action_id: 11 });
						if(response.report.finisher) {
							Models.Log.create({ user_id: user_id, order_id: order.id, action_id: 9 });
						}
					    response.log = await connection.executeOne(
							`select logs.message, logs.additional, logs.created_at, la.name as act, users.nick_name as creator, la.details 
							from logs
							left join logs_actions la on la.id = logs.action_id
							left join users on users.id = logs.user_id
						  	where logs.id = ? limit 1`, {replacements: [log.id], raw: true});
						res.status(200).json(response);
					})();
				})
			} else {
				res.status(202).json({'error':'operation_not_allowed'});
			}
		}).catch(err => {
			res.status(202).json({'error':'internal_error'});
		});

	};

	return controller;
};