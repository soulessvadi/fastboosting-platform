const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const storage = require('../utils/storage');
const path = require('path');
const fs = require('fs');
const async = require('async');

module.exports = (db) => {

	const controller = {};

	controller.get = (req, res, next) => {
		res.json('interface');
	};

	controller.pricelists = (req, res, next) => {
		let user = req.app.user;
		async.parallel({
			categories: (cb) => {
				Models.BoosterPriceCategory.findAll({attributes: ['id','from','till','name','factor'], raw: true})
				.then(results => cb(null, results))
				.catch(e => cb(null, []))
			},
			boosting: (cb) => {
				Models.BoosterPricelistBoosting.findAll({attributes: ['id','from','till','volume','rub','usd'], raw: true})
				.then(results => cb(null, results))
				.catch(e => cb(null, []))
			},
			medal_boost: (cb) => {
				Models.BoosterPricelistMedal.findAll({attributes: ['id','title','rank','image','rub','usd'], raw: true})
				.then(results => cb(null, results))
				.catch(e => cb(null, []))
			},
			calibration: (cb) => {
				cb(null, []);
			},
			training: (cb) => {
				cb(null, []);
			}
		}, (error, stack) => {
			res.status(200).json(stack);
		});
	}

	controller.setMedalPricelist = (req, res, next) => {
		let prices = req.body;
		let data = [];
		prices.forEach(e => {
			if(e.id) {
				Models.BoosterPricelistMedal.update({rub:e.rub, usd: e.usd}, {where:{id: e.id}})
				.then(results => console.log(results))
				.catch(err => console.log(err))
			}
		});
		return res.status(200).json({'status':'ok'});
	};

	controller.setBoostPricelist = (req, res, next) => {
		let prices = req.body;
		let data = [];
		prices.forEach(e => {
			data.push({ 
				from: e.from || 0, 
				till: e.till || 0, 
				volume: e.volume || 0, 
				rub: e.rub || 0, 
				usd: e.usd || 0 
			});
		});
		data = data.sort((a,b) => a.from > b.from ? 1 : -1);
		Models.BoosterPricelistBoosting.destroy({truncate: true}).then(() => {
			Models.BoosterPricelistBoosting.bulkCreate(data).then(() => {
				res.status(200).json({'status':'ok'});
			}).catch(err => res.status(500).json({"error": "internal_error"}));
		}).catch(err => res.status(500).json({"error": "internal_error"}));
	};

	controller.setPricelistCategories = (req, res, next) => {
		let prices = req.body;
		let data = [];
		prices.forEach(e => {
			data.push({ 
				from: e.from || 0, 
				till: e.till || 0, 
				name: e.name || null, 
				factor: e.factor || 0 
			});
		});
		data = data.sort((a,b) => a.from > b.from ? 1 : -1);
		Models.BoosterPriceCategory.destroy({truncate: true}).then(() => {
			Models.BoosterPriceCategory.bulkCreate(data).then(() => {
				res.status(200).json({'status':'ok'});
			}).catch(err => res.status(500).json({"error": "internal_error"}));
		}).catch(err => res.status(500).json({"error": "internal_error"}));
	};

	controller.userTypes = (req, res, next) => {
 		Models.UserType.findAll({attributes:['id','name'], raw: true})
 		.then(types => res.status(200).json(types))
 		.catch(err => res.status(200).json([]))
	}

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

	controller.translate = async (req, res, next) => {
		let locale = req.query.locale || 'us', json, data = {};
		try {
			json = fs.readFileSync(storage.spaces.locales + locale + '.json', 'utf8');
			data = utils.jsonDecode(json);
		} catch(e) {
			json = await Models.Translate.findAll({attributes:['name','us'], order: [['created_at', 'desc']], raw: true});
			json.map(e => { data[e.name] = e.us; });
		}
		res.status(200).json(data);
	};

	controller.translations = {
		get: () => {
			return Models.Translate.findAll({attributes:['id','name','us','ru'], order: [['created_at', 'desc']], raw: true});
		},
		writeToFile: () => {
			return new Promise(resolve => {
				controller.translations.get()
				.then(res => {
					let locales = {ru: {}, us: {}};
					for(let locale in locales) {
						for(let i in res) {
							locales[locale][res[i].name] = res[i][locale] || '';
						}
						fs.writeFileSync(storage.spaces.locales + locale + '.json', utils.jsonEncode(locales[locale]), 'utf8');
					}
					resolve(res);
				})
				.catch(err => resolve([]))
			});
		},
	}

	controller.getTranslations = (req, res, next) => {
		controller.translations.get().then(data => {
			res.status(200).json(data);
		}).catch(err => {
			res.status(500).json({"error":"internal_error"});
		})
	};

	controller.updateTranslations = (req, res, next) => {
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
				controller.translations.writeToFile().then(r => res.status(200).json(r));
			}).catch(err => res.status(500).json({"error": "internal_error"}));
		}).catch(err => res.status(500).json({"error": "internal_error"}));
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

	controller.medals = (req, res, next) => {
		provider.getMedals()
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