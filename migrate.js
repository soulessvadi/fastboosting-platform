const db = require('./app/models/sequelize').connection;
const schemas = require('./app/models/schemas');
const md5 = require('md5');
const http = require('http');
const https = require('https');
const request = require('request');
const moment = require('moment');
const fs = require('fs');
const order_permissions = {
	type: [1,2,3,4],
	source_id: [1,2,3,4],
	mmr_finish: 6000,
	medal_finish: 9999999,
	amount: 9999999,
};

const booster_permissions = {
	1: 	{c:0,r:1,u:0,d:0},
	2: 	{c:0,r:1,u:0,d:0},
	3: 	{c:0,r:1,u:0,d:0},
	4: 	{c:0,r:1,u:0,d:0},
	5: 	{c:0,r:1,u:0,d:0},
	6: 	{c:0,r:1,u:0,d:0},
	7: 	{c:0,r:1,u:0,d:0},
	8: 	{c:0,r:1,u:0,d:0},
	9: 	{c:0,r:1,u:0,d:0},
	10: {c:0,r:1,u:0,d:0},
	11: {c:0,r:1,u:0,d:0},
	12: {c:0,r:1,u:0,d:0},
	13: {c:0,r:1,u:0,d:0},
	14: {c:0,r:1,u:0,d:0},
	15: {c:0,r:1,u:0,d:0},
	16: {c:0,r:1,u:0,d:0},
	17: {c:0,r:1,u:0,d:0},
	18: {c:0,r:1,u:0,d:0},
	19: {c:0,r:1,u:0,d:0},
	20: {c:0,r:1,u:0,d:0},
	21: {c:0,r:1,u:0,d:0},
	22: {c:0,r:1,u:0,d:0},
};

const admin_permissions = {
	1: 	{c:1,r:1,u:1,d:1},
	3: 	{c:1,r:1,u:1,d:1},
	22: {c:1,r:1,u:1,d:1},
	23: {c:1,r:1,u:1,d:1},
	24: {c:1,r:1,u:1,d:1},
	25: {c:1,r:1,u:1,d:1},
	26: {c:1,r:1,u:1,d:1},
	27: {c:1,r:1,u:1,d:1},
	28: {c:1,r:1,u:1,d:1},
	29: {c:1,r:1,u:1,d:1},
	30: {c:1,r:1,u:1,d:1},
	31: {c:1,r:1,u:1,d:1},
	32: {c:1,r:1,u:1,d:1},
	33: {c:1,r:1,u:1,d:1},
	34: {c:1,r:1,u:1,d:1},
	35: {c:1,r:1,u:1,d:1},
	36: {c:1,r:1,u:1,d:1},
	37: {c:1,r:1,u:1,d:1},
	38: {c:1,r:1,u:1,d:1},
	39: {c:1,r:1,u:1,d:1},
	40: {c:1,r:1,u:1,d:1},
	41: {c:1,r:1,u:1,d:1},
	42: {c:1,r:1,u:1,d:1},
	43: {c:1,r:1,u:1,d:1},
	44: {c:1,r:1,u:1,d:1},
	45: {c:1,r:1,u:1,d:1},
	46: {c:1,r:1,u:1,d:1},
	47: {c:1,r:1,u:1,d:1},
	48: {c:1,r:1,u:1,d:1},
	49: {c:1,r:1,u:1,d:1},
	50: {c:1,r:1,u:1,d:1},
};

(async () => {
	await db.sync({force:true, logging: console.log});
	await schemas.OrderPriceCategory.bulkCreate([
		{name: 'F', from: 0.0, till: 0.6, factor: 0.00},
		{name: 'D', from: 0.6, till: 1.5, factor: 0.50},
		{name: 'C', from: 1.5, till: 2.2, factor: 0.80},
		{name: 'B', from: 2.2, till: 2.5, factor: 0.90},
		{name: 'A', from: 2.5, till: 2.8, factor: 1.00},
		{name: 'A+', from: 2.8, till: 3.0, factor: 1.20},
	]);
	await schemas.BoosterPriceCategory.bulkCreate([
		{name: 'F', from: 0.0, till: 0.6, factor: 0.00},
		{name: 'D', from: 0.6, till: 1.5, factor: 0.50},
		{name: 'C', from: 1.5, till: 2.2, factor: 0.80},
		{name: 'B', from: 2.2, till: 2.5, factor: 0.90},
		{name: 'A', from: 2.5, till: 2.8, factor: 1.00},
		{name: 'A+', from: 2.8, till: 3.0, factor: 1.20},
	]);
	await schemas.BoosterPricelistMedal.bulkCreate([
		{title:"Herald", rank:"1",image:"180px-SeasonalRank1-0.png",rub:50.00,usd:0.80},
		{title:"Herald", rank:"2",image:"180px-SeasonalRank1-1.png",rub:50.00,usd:0.80},
		{title:"Herald", rank:"3",image:"180px-SeasonalRank1-2.png",rub:50.00,usd:0.80},
		{title:"Herald", rank:"4",image:"180px-SeasonalRank1-3.png",rub:50.00,usd:0.80},
		{title:"Herald", rank:"5",image:"180px-SeasonalRank1-4.png",rub:50.00,usd:0.80},
		{title:"Herald", rank:"6",image:"180px-SeasonalRank1-5.png",rub:50.00,usd:0.80},
		{title:"Guardian", rank:"1",image:"180px-SeasonalRank2-0.png",rub:50.00,usd:0.80},
		{title:"Guardian", rank:"2",image:"180px-SeasonalRank2-1.png",rub:50.00,usd:0.80},
		{title:"Guardian", rank:"3",image:"180px-SeasonalRank2-2.png",rub:50.00,usd:0.80},
		{title:"Guardian", rank:"4",image:"180px-SeasonalRank2-3.png",rub:50.00,usd:0.80},
		{title:"Guardian", rank:"5",image:"180px-SeasonalRank2-4.png",rub:50.00,usd:0.80},
		{title:"Guardian", rank:"6",image:"180px-SeasonalRank2-5.png",rub:50.00,usd:0.80},
		{title:"Crusader", rank:"1",image:"180px-SeasonalRank3-0.png",rub:50.00,usd:0.80},
		{title:"Crusader", rank:"2",image:"180px-SeasonalRank3-1.png",rub:50.00,usd:0.80},
		{title:"Crusader", rank:"3",image:"180px-SeasonalRank3-2.png",rub:50.00,usd:0.80},
		{title:"Crusader", rank:"4",image:"180px-SeasonalRank3-3.png",rub:50.00,usd:0.80},
		{title:"Crusader", rank:"5",image:"180px-SeasonalRank3-4.png",rub:50.00,usd:0.80},
		{title:"Crusader", rank:"6",image:"180px-SeasonalRank3-5.png",rub:50.00,usd:0.80},
		{title:"Archon", rank:"1",image:"180px-SeasonalRank4-0.png",rub:50.00,usd:0.80},
		{title:"Archon", rank:"2",image:"180px-SeasonalRank4-1.png",rub:50.00,usd:0.80},
		{title:"Archon", rank:"3",image:"180px-SeasonalRank4-2.png",rub:50.00,usd:0.80},
		{title:"Archon", rank:"4",image:"180px-SeasonalRank4-3.png",rub:50.00,usd:0.80},
		{title:"Archon", rank:"5",image:"180px-SeasonalRank4-4.png",rub:50.00,usd:0.80},
		{title:"Archon", rank:"6",image:"180px-SeasonalRank4-5.png",rub:50.00,usd:0.80},
		{title:"Legend", rank:"1",image:"180px-SeasonalRank5-0.png",rub:50.00,usd:0.80},
		{title:"Legend", rank:"2",image:"180px-SeasonalRank5-1.png",rub:50.00,usd:0.80},
		{title:"Legend", rank:"3",image:"180px-SeasonalRank5-2.png",rub:50.00,usd:0.80},
		{title:"Legend", rank:"4",image:"180px-SeasonalRank5-3.png",rub:50.00,usd:0.80},
		{title:"Legend", rank:"5",image:"180px-SeasonalRank5-4.png",rub:50.00,usd:0.80},
		{title:"Legend", rank:"6",image:"180px-SeasonalRank5-5.png",rub:50.00,usd:0.80},
		{title:"Ancient", rank:"1",image:"180px-SeasonalRank6-0.png",rub:50.00,usd:0.80},
		{title:"Ancient", rank:"2",image:"180px-SeasonalRank6-1.png",rub:50.00,usd:0.80},
		{title:"Ancient", rank:"3",image:"180px-SeasonalRank6-2.png",rub:50.00,usd:0.80},
		{title:"Ancient", rank:"4",image:"180px-SeasonalRank6-3.png",rub:50.00,usd:0.80},
		{title:"Ancient", rank:"5",image:"180px-SeasonalRank6-4.png",rub:50.00,usd:0.80},
		{title:"Ancient", rank:"6",image:"180px-SeasonalRank6-5.png",rub:50.00,usd:0.80},
		{title:"Devine", rank:"1",image:"180px-SeasonalRank7-0.png",rub:50.00,usd:0.80},
		{title:"Devine", rank:"2",image:"180px-SeasonalRank7-1.png",rub:50.00,usd:0.80},
		{title:"Devine", rank:"3",image:"180px-SeasonalRank7-2.png",rub:50.00,usd:0.80},
		{title:"Devine", rank:"4",image:"180px-SeasonalRank7-3.png",rub:50.00,usd:0.80},
		{title:"Devine", rank:"5",image:"180px-SeasonalRank7-4.png",rub:50.00,usd:0.80},
		{title:"Devine", rank:"6",image:"180px-SeasonalRank7-5.png",rub:50.00,usd:0.80},
	]);
	await schemas.BoosterPricelistBoosting.bulkCreate([{
		"from": 0,
		"till": 2000,
		"volume": 100,
		"rub": 187,
		"usd": 1.87,
	}, {
		"from": 2000,
		"till": 3000,
		"volume": 100,
		"rub": 200,
		"usd": 2.00,
	}, {
		"from": 3000,
		"till": 3250,
		"volume": 100,
		"rub": 250,
		"usd": 2.50,
	}, {
		"from": 3250,
		"till": 3500,
		"volume": 100,
		"rub": 250,
		"usd": 2.50,
	}, {
		"from": 3500,
		"till": 3750,
		"volume": 100,
		"rub": 293,
		"usd": 2.93,
	}, {
		"from": 3750,
		"till": 4000,
		"volume": 100,
		"rub": 312,
		"usd": 3.12,
	}, {
		"from": 4000,
		"till": 4250,
		"volume": 100,
		"rub": 343,
		"usd": 3.43,
	}, {
		"from": 4250,
		"till": 4500,
		"volume": 100,
		"rub": 375,
		"usd": 3.75,
	}, {
		"from": 4500,
		"till": 4750,
		"volume": 100,
		"rub": 437,
		"usd": 4.37,
	}, {
		"from": 4750,
		"till": 5000,
		"volume": 100,
		"rub": 500,
		"usd": 5.00,
	}, {
		"from": 5000,
		"till": 5250,
		"volume": 100,
		"rub": 750,
		"usd": 7.50,
	}, {
		"from": 5250,
		"till": 5500,
		"volume": 100,
		"rub": 875,
		"usd": 8.75,
	}, {
		"from": 5500,
		"till": 5750,
		"volume": 100,
		"rub": 1062,
		"usd": 10.62,
	}, {
		"from": 5750,
		"till": 6000,
		"volume": 100,
		"rub": 1250,
		"usd": 12.50,
	}, {
		"from": 6000,
		"till": 6250,
		"volume": 100,
		"rub": 1800,
		"usd": 18.00,
	}, {
		"from": 6250,
		"till": 6500,
		"volume": 100,
		"rub": 2000,
		"usd": 20.00,
	}, {
		"from": 6500,
		"till": 6750,
		"volume": 100,
		"rub": 4625,
		"usd": 46.25,
	}, {
		"from": 6750,
		"till": 7000,
		"volume": 100,
		"rub": 6000,
		"usd": 60.00,
	}, {
		"from": 7000,
		"till": 7300,
		"volume": 100,
		"rub": 8000,
		"usd": 80.00,
	}]);
	await schemas.BoosterReview.bulkCreate([
		{order_id: 1, user_id: 1, client_id: 1, comment: 'Nice job', mark: 5},
		{order_id: 3, user_id: 1, client_id: 1, comment: 'Nice job', mark: 3},
		{order_id: 4, user_id: 1, client_id: 1, comment: 'Nice job', mark: 4},
		{order_id: 2, user_id: 1, client_id: 1, comment: 'Nice job', mark: 5},
		{order_id: 5, user_id: 1, client_id: 1, comment: 'Nice job', mark: 5},
		{order_id: 2, user_id: 1, client_id: 1, comment: 'Nice job', mark: 4},
		{order_id: 3, user_id: 1, client_id: 1, comment: 'Nice job', mark: 2},
		{order_id: 4, user_id: 1, client_id: 1, comment: 'Nice job', mark: 2},
		{order_id: 5, user_id: 1, client_id: 1, comment: 'Nice job', mark: 5},
	]);
	await schemas.UserBonusPenalty.bulkCreate([
		{type: 1, name: 'Своевременное выполнение договоренных обязанностей', description: 'Своевременное выполнение договоренных обязанностей', amount: '+10%'},
		{type: 1, name: 'Своевременное выполнение договоренных обязанностей', description: 'Своевременное выполнение договоренных обязанностей', amount: '+10%'},
		{type: 1, name: 'Своевременное выполнение договоренных обязанностей', description: 'Своевременное выполнение договоренных обязанностей', amount: '+10%'},
		{type: 1, name: 'Своевременное выполнение договоренных обязанностей', description: 'Своевременное выполнение договоренных обязанностей', amount: '+10%'},
		{type: 2, name: 'Штрав за невыполнение договоренных обязанностей', description: 'Штрав за невыполнение договоренных обязанностей', amount: '1000 руб'},
		{type: 2, name: 'Штрав за невыполнение договоренных обязанностей', description: 'Штрав за невыполнение договоренных обязанностей', amount: '1000 руб'},
		{type: 2, name: 'Штрав за невыполнение договоренных обязанностей', description: 'Штрав за невыполнение договоренных обязанностей', amount: '1000 руб'},
		{type: 2, name: 'Штрав за невыполнение договоренных обязанностей', description: 'Штрав за невыполнение договоренных обязанностей', amount: '1000 руб'},
	]);
	await schemas.OrderReminderType.bulkCreate([
		{name: 'info'},
		{name: 'warning'},
		{name: 'danger'},
		{name: 'success'},
	]);
	await schemas.OrderReminder.bulkCreate([
		{order_id: 5, user_id: 1, type: 1, title: 'Внимание', note: 'Дедлайн по заказу истекает через 3 дня.', expires_at: '2018-08-27 12:00:00'},
		{order_id: 5, user_id: 1, type: 2, title: 'Внимание', note: 'Дедлайн по заказу истекает через 24 часа.', expires_at: '2018-08-27 12:00:00'},
		{order_id: 5, user_id: 1, type: 3, title: 'Внимание', note: 'Дедлайн по заказу истекает через 12 часов.', expires_at: '2018-08-27 12:00:00'},
		{order_id: 5, user_id: 1, type: 4, title: 'Поздравляем', note: 'Заказ успешно выполнен.', expires_at: '2018-08-27 12:00:00', dismissable: true},
	]);
	await schemas.Post.bulkCreate([
		{
			user_id: 2,
			publish: true,
			cover: 'post.jpg',
			title: 'Lorem ipsum dolor sit amet!',
			preview: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur autem iste suscipit modi fugiat, atque facilis nesciunt commodi odit, officiis sed explicabo. Minus adipisci officia quia nisi sed, voluptate. Iure accusantium, necessitatibus, voluptatem inventore, aspernatur pariatur maxime a laboriosam porro dicta corporis libero. Sapiente officiis ullam mollitia voluptatibus maxime repellendus commodi assumenda voluptates ea. Ipsam.',
			text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur autem iste suscipit modi fugiat, atque facilis nesciunt commodi odit, officiis sed explicabo. Minus adipisci officia quia nisi sed, voluptate. Iure accusantium, necessitatibus, voluptatem inventore, aspernatur pariatur maxime a laboriosam porro dicta corporis libero. Sapiente officiis ullam mollitia voluptatibus maxime repellendus commodi assumenda voluptates ea. Ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur autem iste suscipit modi fugiat, atque facilis nesciunt commodi odit, officiis sed explicabo. Minus adipisci officia quia nisi sed, voluptate. Iure accusantium, necessitatibus, voluptatem inventore, aspernatur pariatur maxime a laboriosam porro dicta corporis libero. Sapiente officiis ullam mollitia voluptatibus maxime repellendus commodi assumenda voluptates ea. Ipsam.',
			expires_at:  moment().add(5, 'days'),
		},{
			user_id: 2,
			publish: true,
			cover: 'post.jpg',
			title: 'Quisquam eius dolorum sequi molestias, eveniet natus, similique debitis',
			preview: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur autem iste suscipit modi fugiat, atque facilis nesciunt commodi odit, officiis sed explicabo. Minus adipisci officia quia nisi sed, voluptate. Iure accusantium, necessitatibus, voluptatem inventore, aspernatur pariatur maxime a laboriosam porro dicta corporis libero. Sapiente officiis ullam mollitia voluptatibus maxime repellendus commodi assumenda voluptates ea. Ipsam.',
			text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur autem iste suscipit modi fugiat, atque facilis nesciunt commodi odit, officiis sed explicabo. Minus adipisci officia quia nisi sed, voluptate. Iure accusantium, necessitatibus, voluptatem inventore, aspernatur pariatur maxime a laboriosam porro dicta corporis libero. Sapiente officiis ullam mollitia voluptatibus maxime repellendus commodi assumenda voluptates ea. Ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur autem iste suscipit modi fugiat, atque facilis nesciunt commodi odit, officiis sed explicabo. Minus adipisci officia quia nisi sed, voluptate. Iure accusantium, necessitatibus, voluptatem inventore, aspernatur pariatur maxime a laboriosam porro dicta corporis libero. Sapiente officiis ullam mollitia voluptatibus maxime repellendus commodi assumenda voluptates ea. Ipsam.',
			expires_at:  moment().add(7, 'days'),
		}
	]);
	await schemas.PayoutRequestStatus.bulkCreate([
		{name: 'На рассмотрении'},
		{name: 'Отклонена'},
		{name: 'Подтверждена'},
	]);
	await schemas.Tx.bulkCreate([
		{system_number: 1, type: 1, amount: 2500, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-06 15:25:00')},
		{system_number: 1, type: 1, amount: 3244, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-07 15:25:00')},
		{system_number: 1, type: 2, amount: -5125, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-08 15:25:00')},
		{system_number: 1, type: 2, amount: -2555, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-09 15:25:00')},
		{system_number: 1, type: 3, amount: 1208, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-09 16:25:00')},
		{system_number: 1, type: 4, amount: -1468, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-11 15:25:00')},
		{system_number: 1, type: 1, amount: 1751, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-11 15:25:00')},
		{system_number: 1, type: 1, amount: 4198, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-12 15:25:00')},
		{system_number: 1, type: 4, amount: 3794, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-13 15:25:00')},
		{system_number: 1, type: 2, amount: -5682, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-14 15:25:00')},
		{system_number: 1, type: 1, amount: 3562, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-14 18:25:00')},
		{system_number: 1, type: 4, amount: -1528, user_id: 1, currency_id: 1, status:3, created_at: new Date('2018-08-15 15:25:00')},
		{system_number: 2, type: 1, amount: 2000, user_id: 2, currency_id: 1, status:3, created_at: new Date('2018-08-16 15:25:00')},
		{system_number: 2, type: 4, amount: -1528, user_id: 2, currency_id: 1, status:3, created_at: new Date('2018-08-17 15:25:00')},
	]);
	await schemas.Currency.bulkCreate([
		{name: 'RUB', sign: '₽', rate: 1.00, used: true},
		{name: 'USD', sign: '$', rate: 67.18, used: true},
		{name: 'UAH', sign: '₴', rate: 24.25, used: false},
	]);
	await schemas.TxType.bulkCreate([
		{name: 'Зачисление'},
		{name: 'Вывод'},
		{name: 'Бонус'},
		{name: 'Штраф'},
	]);
	await schemas.TxStatus.bulkCreate([
		{name: 'В ожидании'},
		{name: 'Отклонена'},
		{name: 'Проведена'},
	]);
	await schemas.SupportTicket.create({
		user_id:1, order_id: 6, theme:'Тема нового тикета 1', description:'Ipsam quaerat recusandae necessitatibus autem eveniet libero maxime beatae dolorem eaque. Voluptatum quia ullam pariatur molestiae autem, labore earum placeat a possimus!'
	}).then(ticket => {
		ticket.update({system_number: ticket.id})
	});
	await schemas.SupportTicket.create({
		user_id:1, order_id: 6, theme:'Тема нового тикета 2', description:'Ipsam quaerat recusandae necessitatibus autem eveniet libero maxime beatae dolorem eaque. Voluptatum quia ullam pariatur molestiae autem, labore earum placeat a possimus!'
	}).then(ticket => {
		ticket.update({system_number: ticket.id})
	});
	await schemas.SupportTicket.create({
		user_id:1, order_id: 6, theme:'Тема нового тикета 3', description:'Ipsam quaerat recusandae necessitatibus autem eveniet libero maxime beatae dolorem eaque. Voluptatum quia ullam pariatur molestiae autem, labore earum placeat a possimus!'
	}).then(ticket => {
		ticket.update({system_number: ticket.id})
	});
	await schemas.SupportTicket.create({
		user_id:1, order_id: 6, theme:'Тема нового тикета 4', description:'Ipsam quaerat recusandae necessitatibus autem eveniet libero maxime beatae dolorem eaque. Voluptatum quia ullam pariatur molestiae autem, labore earum placeat a possimus!'
	}).then(ticket => {
		ticket.update({system_number: ticket.id})
	});
	await schemas.SupportTicket.create({
		user_id:1, order_id: 6, theme:'Тема нового тикета 5', description:'Ipsam quaerat recusandae necessitatibus autem eveniet libero maxime beatae dolorem eaque. Voluptatum quia ullam pariatur molestiae autem, labore earum placeat a possimus!'
	}).then(ticket => {
		ticket.update({system_number: ticket.id})
	});
	await schemas.SupportTicketStatus.bulkCreate([
		{name: 'Новый'},
		{name: 'В процессе'}, 
		{name: 'Отменен'},  
		{name: 'Закрыт'},  
	]);
	await schemas.Menu.bulkCreate([
		{icon:'fas fa-user',name:'Профиль и сводка', link:null, nested_in: 0},
		{name:'Статистика', link:'/profile/statistics', nested_in: 1},
		{name:'Настройки профиля', link:'/profile/settings', nested_in: 1},
		{name:'Активный заказ', link:'/orders/active', nested_in: 1},
		{name:'События', link:'/profile/events', nested_in: 1},
		{icon:'fas fa-balance-scale',name:'Баланс бустера', link:null, nested_in: 0},
		{name:'Информация по балансу', link:'/balance/info', nested_in: 6},
		{name:'Трансакции и списания', link:'/balance/txs', nested_in: 6},
		{name:'Вывод средств', link:'/balance/withdrawal', nested_in: 6},
		{icon:'fas fa-shopping-cart',name:'Заказы', link:null, nested_in: 0},
		{name:'Список заказов', link:'/orders/pending', nested_in: 10},
		{name:'Активный заказ', link:'/orders/active', nested_in: 10},
		{name:'История заказов', link:'/orders/history', nested_in: 10},
		{icon:'fas fa-list-alt',name:'Условия работы', link:null, nested_in: 0},
		{name:'Условия и согласия', link:'/conditions/agreements', nested_in: 14},
		{name:'Прайс-лист', link:'/conditions/pricelists', nested_in: 14},
		{name:'Бонусы и штрафы', link:'/conditions/bonuses&penalties', nested_in: 14},
		{icon:'fas fa-life-ring',name:'Поддержка бустера', link:null, nested_in: 0},
		{name:'Список тикетов', link:'/support/issues', nested_in: 18},
		{name:'Новый тикет', link:'/support/newissue', nested_in: 18},
		{name:'Контакты сайта', link:'/support/contacts', nested_in: 18},

		{icon:'fas fa-shopping-cart',name:'Управление заказами', link:null, nested_in: 0},
		{name:'Все заказы', link:'/govt/orders', nested_in: 22},
		{name:'Проблемные заказы', link:'/govt/orders/problematic', nested_in: 22},
		{icon:'fas fa-dollar-sign',name:'Финансы', link:null, nested_in: 0},
		{name:'Пополнения (клиент)', link:'/govt/finances/client-refill', nested_in: 25},
		{name:'Списания (клиент)', link:'/govt/finances/client-writeoff', nested_in: 25},
		{name:'Вывод средств (бустер)', link:'/govt/finances/booster-payoff', nested_in: 25},
		{name:'Отчеты по заказам (бустер)', link:'/govt/finances/booster-reports', nested_in: 25},
		{name:'Штрафы и бонусы (бустер)', link:'/govt/finances/booster-bonuses', nested_in: 25},
		{icon:'fas fa-users',name:'Пользователи', link:null, nested_in: 0},
		{name:'Клиенты', link:'/govt/users/list', nested_in: 31},
		{name:'Новый пользователь', link:'/govt/users/new', nested_in: 31},
		{name:'Привелегии', link:'/govt/users/privileges', nested_in: 31},
		{icon:'fas fa-users',name:'Бустеры', link:null, nested_in: 0},
		{name:'Статистика', link:'/govt/boosters/statistics', nested_in: 35},
		{name:'Список', link:'/govt/boosters/list', nested_in: 35},
		{name:'Новый бустер', link:'/govt/boosters/new', nested_in: 35},
		{icon:'fas fa-users',name:'Партнеры', link:null, nested_in: 0},
		{name:'Статистика', link:'/govt/partners/statistics', nested_in: 39},
		{name:'Список', link:'/govt/partners/list', nested_in: 39},
		{name:'Новый бустер', link:'/govt/partners/new', nested_in: 39},
		{icon:'fas fa-cogs',name:'Настройки системы', link:null, nested_in: 0},
		{name:'Прайс-листы', link:'/govt/settings/pricelists', nested_in: 43},
		{name:'Автоматические штрафы и бонусы', link:'/govt/settings/bonuses&penalties', nested_in: 43},
		{icon:'far fa-life-ring',name:'Служба поддержки', link:null, nested_in: 0},
		{name:'Тикеты от клиентов', link:'/govt/support/clients', nested_in: 46},
		{name:'Тикеты от бустеров', link:'/govt/support/boosters', nested_in: 46},
		{name:'Тикеты от партнеров', link:'/govt/support/partners', nested_in: 46},
		{icon:'fas fa-exchange-alt',name:'Языковые переводы', link:'/govt/sundry/translations', nested_in: 0},
	]);
	await schemas.LogAction.bulkCreate([
		{name:'user_registered', details:'Регистрация в системе'},
		{name:'user_authorized', details:'Вход в аккаунт'},
		{name:'user_configured_profile', details:'Проведена стартовая настройка профиля'},
		{name:'user_changed_profile', details:'Настройка профиля'},
		{name:'user_changed_password', details:'Смена пароля от аккаунта'},
		{name:'user_blocked', details:'Заблокирован'},
		{name:'booster_joined_order', details:'Подключен к работе по заказу'},
		{name:'booster_canceled_order', details:'Заказ отлонен работником'},
		{name:'booster_finished_order', details:'Завершена работа над заказом'},
		{name:'booster_linked_dotabuff', details:'К заказу привязан аккаунт dotabuff'},
		{name:'booster_added_order_report', details:'Добавлен отчет по заказу'},
		{name:'booster_added_order_issue', details:'Добавлен тикет по заказу'},
		{name:'booster_was_rewarded', details:''},
		{name:'booster_was_appealed', details:''},
		{name:'booster_was_disabled', details:''},
		{name:'booster_added_ticket', details:''},
		{name:'user_recovery_requested', details:'Отправил запрос на смену пароля'},
		{name:'user_changed_ticket', details:'Изменил настройки тикета'},
		{name:'user_pinned_ticket', details:'Отметил тикет как важный'},
		{name:'user_closed_ticket', details:'Закрыл тикет'},
		{name:'user_canceled_ticket', details:'Отменил тикет'},
		{name:'user_changed_order', details:'Изменил настройки заказа'},
		{name:'user_canceled_order', details:'Отклонил заказ'},
		{name:'user_added_order_booster', details:'Назначил ответственного бустера'},
		{name:'user_changed_order_booster', details:'Сменил ответственного бустера'},
	]);
	await schemas.Log.bulkCreate([
		{user_id:1,order_id:8,action_id:6,message:'Описание залогированного события'},
		{user_id:1,order_id:8,action_id:10,message:'Описание залогированного события'},
		{user_id:1,order_id:8,action_id:9,message:'Описание залогированного события'},
	]);
	await schemas.OrderReport.bulkCreate([
		{order_id:8,user_id:1,comment:'Все пошло по плану',mmr:2555,mmr_diff:1000,result:'win'},
		{order_id:8,user_id:1,comment:'Все пошло по плану',mmr:3250,mmr_diff:1000,result:'win'},
		{order_id:8,user_id:1,comment:'Все пошло по плану',mmr:4550,mmr_diff:1000,result:'win'},
		{order_id:8,user_id:1,comment:'Все пошло по плану',mmr:4575,mmr_diff:1000,result:'win'},
		{order_id:8,user_id:1,comment:'Все пошло по плану',mmr:5775,mmr_diff:1000,result:'win'},
	]);
	await schemas.Contact.bulkCreate([
		{name: 'Discord по заказам', description: 'Обращаться исключительно по вопросам и/или проблемам с заказами', contact: 'discord address'},
		{name: 'Discord по оплате работы', description: 'Обращаться по вопросам оплаты работы', contact: 'discord address'},
	]);
	await schemas.OrderHistory.bulkCreate([
		{action: 1,finisher: false,order_id: 7,worker_id: 1,worker_rank: 2.5,rank:0,salary:0,note: ''},
		{action: 2,finisher: true,order_id: 7,worker_id: 1,worker_rank: 2.5,rank:2.8,salary:80,note: 'Заказ завершен с отличием!'},
		{action: 1,finisher: false,order_id: 8,worker_id: 1,worker_rank: 2.5,rank:0,salary:0,note: ''},
	]);	
	await schemas.User.bulkCreate([
		{rating: 2.5, rating_id: 4, order_permissions: order_permissions, permissions: booster_permissions, login: 'booster@gmail.com', password: md5('11111111'), is_approved: 1, is_blocked: 0, lanes: '[1,3]', heroes: '[1,2,55,82]', first_name:'Voodoo', last_name:'Savage', nick_name:'savage 77', type: 3, avatar: 'image_1533404228247.jpg', phone: '099-999-99-99', country: 'Ukraine', email: 'ondarkpath@gmail.com', skype:'skype99', discord: 'discord99'},
		{rating: 2.5, rating_id: 4, order_permissions: order_permissions, permissions: admin_permissions, login: 'admin@gmail.com', password: md5('11111111'), is_approved: 1, is_blocked: 0, lanes: '[1,3]', heroes: '[1,2,55,82]', first_name:'Voodoo', last_name:'Savage', nick_name:'savage 77', type: 3, avatar: 'image_1533404228247.jpg', phone: '099-999-99-99', country: 'Ukraine', email: 'ondarkpath@gmail.com', skype:'skype99', discord: 'discord99'},
		{login: 'client1@gmail.com', password: md5('11111111'), first_name:'Voodoo', last_name:'Savage', nick_name:'Voodoo Savage', email: 'ondarkpath@gmail.com',type:4},
		{login: 'client2@gmail.com', password: md5('11111111'), first_name:'Savage', last_name:'Voodoo', nick_name:'Savage Voodoo', email: 'ondarkpath@gmail.com',type:4},
	]);
	await schemas.UserType.bulkCreate([
		{name:'Admin', 		permissions: admin_permissions, order_permissions: order_permissions},
		{name:'Support', 	permissions: admin_permissions, order_permissions: order_permissions},
		{name:'Booster', 	permissions: booster_permissions, order_permissions: order_permissions},
		{name:'Client', 	permissions: null, order_permissions: null},
	]);	
	await schemas.Partner.bulkCreate([
		{name:'fastboosting.ru'},
		{name:'z3ddota.com'},
		{name:'z3dboosting.com'},
	]);	
	await schemas.OrderServer.bulkCreate([
		{name: 'US'}, 
		{name: 'SA'}, 
		{name: 'EU'}, 
		{name: 'SEA'}, 
		{name: 'AUS'}, 
		{name: 'CN'}, 
		{name: 'RUS'}, 
	]);
	await schemas.OrderType.bulkCreate([
		{name:'Бустинг'},
		{name:'Калибровка'},
		{name:'Буст медали'},
		{name:'Тренинг'},
	]);	
	await schemas.Lane.bulkCreate([
		{name:'Mid'},
		{name:'Safe'},
		{name:'Hard'},
	]);	
	await schemas.Order.bulkCreate([
		{amount: 150.99, amount_paid: 150.99, salary_rub: 120.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858912',type: 2,partner_id: 2,client_id: 3,client_comment: 'My high priority order #2 comment!',quality: 1,lanes: null,heroes: null,heroes_ban: null,mmr_start: 0,mmr_finish: 0,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 90.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858911',type: 3,partner_id: 2,client_id: 4,client_comment: 'My high priority order #3 comment!',quality: 1,lanes: null,heroes: [2,5,8,26,73,56],heroes_ban: [9,88], servers: null, mmr_start: 0,mmr_finish: 0,mmr_boosted: 0,medal_start: 3,medal_finish: 24,medal_current:7,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 105.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858914',type: 1,partner_id: 1,client_id: 3,client_comment: 'My high priority order #1 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,26,73],heroes_ban: null, servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 130.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858915',type: 1,partner_id: 1,client_id: 3,client_comment: 'My high priority order #4 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,73,56],heroes_ban: [3,88], servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 45.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858916',type: 1,partner_id: 2,client_id: 3,client_comment: 'My high priority order #5 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,26,73],heroes_ban: [4,9,88], servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 58.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858917',type: 1,partner_id: 1,client_id: 4,client_comment: 'My high priority order #6 comment!',quality: 1,lanes: [1,3],heroes: [8,26,73,56],heroes_ban: [3,4,9], servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 75.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858918',type: 4,partner_id: 2,client_id: 4,client_comment: 'My high priority order #7 comment!',quality: 1,lanes: null,heroes: [2,5,8,56],heroes_ban: null, servers: null, mmr_start: 2300,mmr_finish: 0,mmr_boosted: 0,medal_start: 0,medal_finish: 0,training_time_from: new Date(), training_time_till: new Date().setHours(new Date().getHours() + 8),training_hours: 8,training_services: [2,3,4,5,6,7],training_worker_id: 1,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 92.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858919',type: 1,partner_id: 2,client_id: 3,client_comment: 'My high priority order #7 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,56,92,94],heroes_ban: [15,27,64,19], servers: [2,3], mmr_start: 2300,mmr_finish: 7500,mmr_boosted: 3275,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 120.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858912',type: 2,partner_id: 2,client_id: 4,client_comment: 'My high priority order #2 comment!',quality: 1,lanes: null,heroes: null,heroes_ban: null,mmr_start: 0,mmr_finish: 0,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 90.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858911',type: 3,partner_id: 2,client_id: 3,client_comment: 'My high priority order #3 comment!',quality: 1,lanes: null,heroes: [2,5,8,26,73,56],heroes_ban: [9,88], servers: null, mmr_start: 0,mmr_finish: 0,mmr_boosted: 0,medal_start: 3,medal_finish: 24,medal_current:7,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 105.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858914',type: 1,partner_id: 1,client_id: 4,client_comment: 'My high priority order #1 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,26,73],heroes_ban: null, servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 130.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858915',type: 1,partner_id: 1,client_id: 3,client_comment: 'My high priority order #4 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,73,56],heroes_ban: [3,88], servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 45.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858916',type: 1,partner_id: 2,client_id: 4,client_comment: 'My high priority order #5 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,26,73],heroes_ban: [4,9,88], servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 58.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858917',type: 1,partner_id: 1,client_id: 4,client_comment: 'My high priority order #6 comment!',quality: 1,lanes: [1,3],heroes: [8,26,73,56],heroes_ban: [3,4,9], servers: [2,3], mmr_start: 2300,mmr_finish: 5500,mmr_boosted: 0,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 75.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858918',type: 4,partner_id: 2,client_id: 4,client_comment: 'My high priority order #7 comment!',quality: 1,lanes: null,heroes: [2,5,8,56],heroes_ban: null, servers: null, mmr_start: 2300,mmr_finish: 0,mmr_boosted: 0,medal_start: 0,medal_finish: 0,training_time_from: new Date(), training_time_till: new Date().setHours(new Date().getHours() + 8),training_hours: 8,training_services: [2,3,4,5,6,7],training_worker_id: 1,status: 5,urgency_hours: 10},
		{amount: 150.99, amount_paid: 150.99, salary_rub: 92.99, deadline: moment().add(2,'days'),account_login:'acc202551',account_pass:'12345',system_number:'104858919',type: 1,partner_id: 2,client_id: 3,client_comment: 'My high priority order #7 comment!',quality: 1,lanes: [1,3],heroes: [2,5,8,56,92,94],heroes_ban: [15,27,64,19], servers: [2,3], mmr_start: 2300,mmr_finish: 7500,mmr_boosted: 3275,medal_start: 0,medal_finish: 0,status: 5,urgency_hours: 10},
	]);
	await schemas.OrderCalibrationType.bulkCreate([
		{name:'Калибровка с гарантией'},
		{name:'Калибровка без гарантий'},
	]);	
	await schemas.OrderStatus.bulkCreate([
		{name:'Новый', desc:'Только созданный заказ'},
		{name:'Ошибка оплаты', desc:'Оплата не проведена по каким либо причинам'},
		{name:'Отмена оплаты', desc:'Оплата не проведена по причине отмены клиентом'},
		{name:'Ожидает настройки', desc:'Ожидает настройки данных клиентом'},
		{name:'Ожидает бустера', desc:'Заказ в поисках бустера'},
		{name:'В работе', desc:'Бустер подтвержден'},
		{name:'Завершен', desc:'Заказ завершен и ожидает отзыва от клиента'},
		{name:'Подтвержден клиентом', desc:'Заказ завершен, отзыв получен'},
		{name:'Ошибка', desc:'Заказ проблемный и ожидает коррекции данных'},
		{name:'Отменен', desc:'Заказ отменет клиентом либо сервисом'},
	]);
	await schemas.TrainingService.bulkCreate([
		{name:'Обучение фарму'},
		{name:'Игра на миде'},
		{name:'Игра на тяжелой линии'},
		{name:'Игра на кэрри'},
		{name:'Игра на саппорте'},
		{name:'Игра на роумерах'},
		{name:'Освоить конкретного героя'},
		{name:'Другое (анализ реплеев и т.д.)'},
	]);	
	await schemas.OrderRankingSpeed.bulkCreate([
		{name: 'F',from: 0,till: 60,ratio: 0},
		{name: 'D',from: 60,till: 70,ratio: 0.3},
		{name: 'C',from: 70,till: 80,ratio: 0.6},
		{name: 'B',from: 80,till: 90,ratio: 0.8},
		{name: 'A',from: 90,till: 100,ratio: 1},
		{name: 'A+',from: 100,till: 999,ratio: 1},
	]);
	await schemas.OrderRankingWinrate.bulkCreate([
		{name: 'F',from: 0,till: 40,ratio: 0},
		{name: 'D',from: 40,till: 50,ratio: 0.3},
		{name: 'C',from: 50,till: 60,ratio: 0.6},
		{name: 'B',from: 60,till: 70,ratio: 0.8},
		{name: 'A',from: 70,till: 80,ratio: 1},
		{name: 'A+',from: 80,till: 999,ratio: 1},
	]);
	await schemas.OrderRankingMark.bulkCreate([
		{name: 'F',mark: 1,ratio: 0},
		{name: 'D',mark: 2,ratio: 0.3},
		{name: 'C',mark: 3,ratio: 0.6},
		{name: 'B',mark: 4,ratio: 0.8},
		{name: 'A',mark: 5,ratio: 1},
	]);	
	await schemas.PayMethod.bulkCreate([
		{name:'Visa/MasterCard'},
		{name:'QIWI'},
		{name:'Yandex.Money'},
	]);	
	await schemas.PayProp.bulkCreate([
		{prop:'8741012401250681', method_id:1, country:'Ukraine', user_id:1, default:1},
		{prop:'0999999999', method_id:2, country:'Ukraine', user_id:1, default:0},
	]);	
	await schemas.Translate.bulkCreate([
		{name: '', us: '', ru: ''},
	]);
	await new Promise(function(resolve, reject) {
		https.get(`https://restcountries.eu/rest/v2/all`, (res) => {
		  	let data = '';
		  	res.on('data', (chunk) => { data += chunk });
		  	res.on('end', () => {
				let countries = [];
				data = JSON.parse(data);
				for(let x in data) {
					countries.push({name: data[x].name, alpha2: data[x].alpha2Code, alpha3: data[x].alpha3Code, region: data[x].region});
				}
				resolve(schemas.Country.bulkCreate(countries));
		  	});

		})
		.on("error", (err) => { console.log("Error: " + err.message); });
	});	
	await new Promise(function(resolve, reject) {
		let api_key='D820EA8DC6FF98314353F6D6E645F061';
		http.get(`http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v0001/?language=en_us&key=${api_key}`, (res) => {
		  	let data = '';
		  	res.on('data', (chunk) => { data += chunk });
		  	res.on('end', () => {
				data = JSON.parse(data);
				let heroes = data.result.heroes; 
		    	if(heroes.length) {
					let download = function(uri, filename, callback) {
					  request.head(uri, function(err, res, body) {
					    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
					  });
					};
					(function loop(x) {
						if(x < 0) return resolve(schemas.Hero.bulkCreate(heroes));
				        let name = heroes[x].name.replace('npc_dota_hero_', '');
				        heroes[x].localized_name = heroes[x].localized_name.replace("'", "`");
				        heroes[x].img_vr = "http://cdn.dota2.com/apps/dota2/images/heroes/"+name+"_vert.jpg";
				        heroes[x].img_lg = "http://cdn.dota2.com/apps/dota2/images/heroes/"+name+"_lg.png";
				        heroes[x].img_md = "http://cdn.dota2.com/apps/dota2/images/heroes/"+name+"_hphover.png";
				        heroes[x].img_sm = "http://cdn.dota2.com/apps/dota2/images/heroes/"+name+"_sb.png";
				        loop(x - 1);
					    download(heroes[x].img_vr, 'storage/cdn/heroes/' + heroes[x].id + '_vr.jpg', () => { 
					       	download(heroes[x].img_lg, 'storage/cdn/heroes/' + heroes[x].id + '_lg.png', () => { 
						    	download(heroes[x].img_md, 'storage/cdn/heroes/' + heroes[x].id + '_md.png', () => { 
						       		download(heroes[x].img_sm, 'storage/cdn/heroes/' + heroes[x].id + '_sm.png', () => {
						       			loop(x - 1);
						       		});
					       		});
						   	});
				   		});
					})(heroes.length - 1);
				}
		  	});

		})
		.on("error", (err) => { console.log("Error: " + err.message); });
	});
	process.exit();
})();