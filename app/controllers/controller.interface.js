const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const Op = connection.Sequelize.Op;
const provider = require('../models/provider');
const path = require('path');
const fs = require('fs');
const utils = require('../utils/helpers');

module.exports = (db) => {

	const controller = {};

	controller.get = (req, res, next) => {
		res.json('interface');
	};

	controller.menu = (req, res, next) => {
		let user_id = req.app.user.id;
		Models.User.findById(user_id).then(user => {
			if(!user) return res.status(500).json('user_absent');
			let allowed = Object.keys(user.permissions).join(',') || 0;
			connection.execute(`
				select m.id, m.name, m.link, m.icon  from menus m
				where m.display = 1 and m.nested_in = 0 and m.id in (${allowed})
				order by m.display_id`, {raw: true})
			.then(parents => {
				(async function loopthrogh(x) {
					if(x < 0) return res.status(200).json({list: parents});
					try {
						parents[x].nestings = await connection.execute(`
							select m.id, m.name, m.link, m.icon from menus m
							where m.display = 1 and m.nested_in = ${parents[x].id} and m.id in (${allowed})
							order by m.display_id`,{raw: true});
					} catch(e) {
						parents[x].nestings = [];
					}
					loopthrogh(--x);
				})(parents.length - 1);
			}).catch(err => res.status(500).json({"error":"internal_error"}));
		}).catch(err => res.status(500).json({"error":"internal_error"}));
	};

	controller.translate = (req, res, next) => {
		let locale = req.query.locale || 'us', json;
		try {
			json = fs.readFileSync(path.join(__dirname, 'i18n', locale + '.json'));  
		} catch(e) {
			json = '';
		}
		data = JSON.parse(json);
		res.status(200).json(data);
	};

	controller.getTranslations = () => {
 		return Models.Translate.findAll({attributes:['id','name','us','ru'], order: [['created_at', 'desc']], raw: true});
	}

	controller.translations = (req, res, next) => {
		controller.getTranslations().then(data => {
			res.status(200).json(data);
		}).catch(err => {
			res.status(500).json({"error":"internal_error"});
		})
	};

	controller.translationsU = (req, res, next) => {
		let translations = req.body;
		let to_delete = translations.filter(e => e.id && e.d);
		let to_update = translations.filter(e => e.id && e.u);
		let to_create = translations.filter(e => !e.id && !e.d);
		to_update.forEach(e => {
			Models.Translate.update({ name: e.name, ru: e.ru, us: e.us }, { where : { id : e.id }});
		});
		Models.Translate.destroy(
			{ where: { id: to_delete.map(e => e.id) } }
		).then(() => {
			Models.Translate.bulkCreate(
				to_create.map(e => new Object({ name: e.name, ru: e.ru, us: e.us }))
			).then(() => {
				controller.getTranslations().then(data => {
					res.status(200).json(data);
				}).catch(err => {
					res.status(500).json({"error":"internal_error"});
				});
			}).catch(err => res.status(500).json({"error": err + "internal_error"}));
		}).catch(err => res.status(500).json({"error": err + "internal_error"}));
	};

	controller.countries = (req, res, next) => {
		provider.getCountries()
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((e) => {
			res.status(500).json({"error":"internal_error"});
		});
	};	

	controller.heroes = (req, res, next) => {
		provider.getHeroes()
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((e) => {
			res.status(500).json({"error":"internal_error"});
		});
	};	

	controller.servers = (req, res, next) => {
		provider.getServers()
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((e) => {
			res.status(500).json({"error":"internal_error"});
		});
	};

	controller.lanes = (req, res, next) => {
		provider.getLanes()
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((e) => {
			res.status(500).json({"error":"internal_error"});
		});
	};	

	controller.paymethods = (req, res, next) => {
		provider.payMethods()
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((e) => {
			res.status(500).json({"error":"internal_error"});
		});
	};

	

	return controller;

};