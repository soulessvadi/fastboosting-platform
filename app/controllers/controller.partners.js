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

	controller.generateKey = () => {
		return randstr.generate(32);
	};

	controller.keygen = (req, res, next) => {
		Models.Partner.findAll({attributes:['login'], raw: true}).then((partners) => {
			let keys = partners.map(e => e.login);
			let key = controller.generateKey();
			while(keys.includes(key)) key = controller.generateKey();
			res.status(200).json({key:key});
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};
	
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
		if(!req.body.login || req.body.login.length < 32 || !req.body.name || req.body.name.length < 2) {
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
			mock.twitter = (req.body.twitter || mock.twitter);
			mock.youtube = (req.body.youtube || mock.youtube);
			mock.country = (req.body.country || mock.country);
			mock.name = (req.body.name || mock.name);
			mock.domain = (req.body.domain || mock.domain);
			mock.email = (req.body.email || mock.email);
			mock.login = (req.body.login || controller.generateKey());			
			if(typeof req.file != typeof undefined) {
				mock.avatar = req.file.filename;
				utils.image(storage.spaces.avatars + mock.avatar).resize('avatar');
			}
			mock.save().then((user) => {
	    		res.status(200).json({status:'ok',id:user.id});
			}).catch((err) => {console.log(err), res.status(202).json({'error':'validation_error'})});
		}).catch((err) => {console.log(err), res.status(202).json({'error':'validation_error'})});
	};

	controller.remove = (req, res, next) => {
		if(req.params.id) {
			Models.Partner.findById(req.params.id).then((partner) => {
				Models.PartnerArchive.create(partner.dataValues).then(r => {
					partner.destroy().then(() => {
			    		res.status(200).json({'status':'ok'});
					}).catch((err) => res.status(202).json({'error': 'internal_error'}));
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'partner_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.partnerUpdate = (req, res, next) => {
		if(req.params.id) {
			Models.Partner.findById(req.body.id).then((partner) => {
				let data = { 
					is_blocked: (req.body.is_blocked || partner.is_blocked),
					is_approved: (req.body.is_approved || partner.is_approved),
					currency_id: (req.body.currency_id || partner.currency_id),
					discord: (req.body.discord || partner.discord),
					skype: (req.body.skype || partner.skype),
					phone: (req.body.phone || partner.phone),
					vkontakte: (req.body.vkontakte || partner.vkontakte),
					facebook: (req.body.facebook || partner.facebook),
					instagram: (req.body.instagram || partner.instagram),
					twitter: (req.body.twitter || partner.twitter),
					youtube: (req.body.youtube || partner.youtube),
					country: (req.body.country || partner.country),
					name: (req.body.name || partner.name),
					domain: (req.body.domain || partner.domain),
					email: (req.body.email || partner.email),
					login: (req.body.login || partner.login),
				};
				if(typeof req.file != typeof undefined) {
					data.avatar = req.file.filename;
					utils.image(storage.spaces.avatars + data.avatar).resize('avatar');
				}
				partner.update(data).then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'partner_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.all = (req, res, next) => {
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 15;
      	let limits = page * perpage - perpage + ', ' + perpage;
		let sortfields = ['id', 'created_at', 'name', 'domain', 'orders_count', 'orders_amount'];
		let sortdir = req.query.asc && req.query.asc == 'true' ? 'asc' : 'desc';
		let sortfield = sortfields.includes(req.query.sort) ? req.query.sort : sortfields[0];
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;     
		let conditions = ``;
		if(keyword) conditions += `and (login like '%${keyword}%' or name like '%${keyword}%' or domain like '%${keyword}%' or email like '%${keyword}%' or phone like '%${keyword}%' or skype like '%${keyword}%' or discord like '%${keyword}%' or id like '${keyword}%')`; 	
		connection.execute(
			`select id, login, email, name, domain, is_blocked, is_approved, avatar, country, phone, skype, discord, created_at,
			(select name from currencies where id = partners.currency_id limit 1) as currency,
			(select count(id) from orders where partner_id = partners.id limit 1) as orders_count,
			coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and partner_id = partners.id limit 1), 0) as orders_amount,
		 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 1 and partner_id = partners.id limit 1), 0) as orders_amount_paid_rub,
		 	coalesce((select sum(amount_paid) from orders where status in (4,5,6,7,8) and currency_id = 2 and partner_id = partners.id limit 1), 0) as orders_amount_paid_usd
			from partners where 1 ${conditions} order by ${sortfield} ${sortdir} limit ${limits}`, { raw: true })
		.then((users) => {
			let response = { users: { list: users } };
			connection.executeOne(`select count(id) as total from partners where 1 ${conditions} limit 1`, {raw: true})
			.then(count => {
	            response.users.total = count.total;
	            let pages = Math.ceil(count.total/perpage);
	            response.users.pagination = utils.paginate(page, perpage, pages, 3);
		    	res.status(200).json(response);
			}).catch((err) => res.status(202).json({'error':'internal_error'}));
		}).catch((err) => res.status(202).json({'error':'internal_error'}));
	};

	controller.partner = (req, res, next) => {
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
						 (select name from currencies where id = partners.currency_id limit 1) as currency_name
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
			pricelist_boost: (cb) => {
				Models.PartnerPricelistBoosting.findAll({where:{partner_id: partner_id}, attributes: ['id','from','till','volume','rub','usd'], raw: true})
				.then(results => cb(null, results))
				.catch(e => cb(null, []))
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

	controller.setPartnerBoostPricelist = (req, res, next) => {
		let partner_id = parseInt(req.params.id) || 0;
		if(req.params.id) {
			let prices = req.body;
			let data = [];
			prices.forEach(e => {
				data.push({ 
					partner_id: partner_id,
					from: e.from || 0, 
					till: e.till || 0, 
					volume: e.volume || 0, 
					rub: e.rub || 0, 
					usd: e.usd || 0 
				});
			});
			data = data.sort((a,b) => a.from > b.from ? 1 : -1);
			Models.PartnerPricelistBoosting.destroy({where:{partner_id: partner_id}}).then(() => {
				Models.PartnerPricelistBoosting.bulkCreate(data).then(() => {
					res.status(200).json({'status':'ok'});
				}).catch(err => res.status(202).json({"error": err + "internal_error"}));
			}).catch(err => res.status(202).json({"error": err + "internal_error"}));
		} else {
			res.status(202).json({"error": "bad_parameters"});
		}
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