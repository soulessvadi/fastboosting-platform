const Router = require('express').Router();
const Connection = require('./models/sequelize').connection;
const Utils = require('./utils/helpers');
const Guards = require('./utils/guards');
const Storage = require('./utils/storage');
const ApiController = require('./controllers/controller.api.js');
const BaseController = require('./controllers/controller.base.js')(Connection);
const UsersController = require('./controllers/controller.users.js')(Connection);
const PartnersController = require('./controllers/controller.partners.js')(Connection);
const IntefaceController = require('./controllers/controller.interface.js')(Connection);
const OrdersController = require('./controllers/controller.orders.js')(Connection);
const TicketsController = require('./controllers/controller.tickets.js')(Connection);
const NewsController = require('./controllers/controller.news.js')(Connection);
const AuthController = require('./controllers/controller.auth.js')(Connection);
const TxsController = require('./controllers/controller.txs.js')(Connection);

Router.use(ApiController.init);

/* Public methods */
Router.post('/register', AuthController.register);
Router.post('/authorize', AuthController.authorize);
Router.post('/recovery', AuthController.recovery);
Router.post('/recovery/:hash', AuthController.recoveryPassword);
Router.get('/users/locked/:id', AuthController.userLocked);
Router.get('/users/verify/:hash', AuthController.userVerify);
/* Public methods */

/* Interface */
Router.get('/', BaseController.info);
Router.get('/interface', Guards.auth, IntefaceController.get);
Router.get('/interface/userTypes', Guards.auth, IntefaceController.userTypes);
Router.get('/interface/menu', Guards.auth, IntefaceController.menu);
Router.get('/interface/translate', IntefaceController.translate);
Router.get('/interface/translations', IntefaceController.getTranslations);
Router.post('/interface/translations', IntefaceController.updateTranslations);
Router.get('/interface/heroes', IntefaceController.heroes);
Router.get('/interface/medals', IntefaceController.medals);
Router.get('/interface/servers', IntefaceController.servers);
Router.get('/interface/lanes', IntefaceController.lanes);
Router.get('/interface/countries', IntefaceController.countries);
Router.get('/interface/paymethods', IntefaceController.paymethods);
Router.get('/interface/pricelists', Guards.auth, IntefaceController.pricelists);
Router.get('/interface/bonuses&penalties', Guards.auth, IntefaceController.bonusesAndPenalties);
Router.post('/interface/bonuses&penalties', Guards.auth, IntefaceController.setBonusesAndPenalties);
Router.post('/interface/pricelists/boost', Guards.auth, IntefaceController.setBoostPricelist);
Router.post('/interface/pricelists/medal', Guards.auth, IntefaceController.setMedalPricelist);
Router.post('/interface/pricelists/calibration', Guards.auth, IntefaceController.setCalibrationPricelist);
Router.post('/interface/pricelists/training', Guards.auth, IntefaceController.setTrainingPricelist);
Router.post('/interface/pricelists/trainingService', Guards.auth, IntefaceController.setTrainingServicePricelist);
Router.post('/interface/pricelists/categories', Guards.auth, IntefaceController.setPricelistCategories);
Router.post('/interface/pricelists/orderCategories', Guards.auth, IntefaceController.setPricelistOrderCategories);
/* Interface */

/* Txs */
Router.get('/txs', Guards.auth, TxsController.all);
Router.post('/txs', Guards.auth, TxsController.create);
Router.delete('/txs/:id', Guards.auth, TxsController.remove);
Router.put('/txs/:id', Guards.auth, TxsController.update);
Router.get('/txs/:id', Guards.auth, TxsController.tx);

/* Txs */

/* Orders */
Router.get('/orders/all', Guards.auth, OrdersController.all);
Router.get('/orders/reports', Guards.auth, OrdersController.reports);
Router.delete('/orders/reports/:id', Guards.auth, OrdersController.removeReport);
Router.delete('/orders/reports/screenshot/:src', Guards.auth, OrdersController.removeScreenshot);
Router.put('/orders/reports/:id', Guards.auth, Storage.screenshots.any('files[]'), OrdersController.updateReport);
Router.get('/orders/problematic', Guards.auth, OrdersController.problematic);
Router.get('/orders/pending', Guards.auth, OrdersController.accessible);
Router.get('/orders/history', Guards.auth, OrdersController.history);
Router.get('/orders/active', Guards.auth, OrdersController.active);
Router.post('/orders/active/issue', Guards.auth, OrdersController.issue);
Router.post('/orders/active/report', Guards.auth, Storage.screenshots.any('files[]'), OrdersController.report);
Router.post('/orders/active/workerStatus', Guards.auth, OrdersController.workerStatus);
Router.post('/orders/active/setDotabuff', Guards.auth, OrdersController.setDotabuff);
Router.post('/orders/active/cancelOrder', Guards.auth, OrdersController.cancelOrder);
Router.post('/orders/joinOrder', Guards.auth, OrdersController.joinOrder);
Router.get('/orders/:number', Guards.auth, OrdersController.order);
Router.post('/orders/:number', Guards.auth, OrdersController.orderUpdate);
/* Orders */

/* Tickets */
Router.post('/tickets/', Guards.auth, TicketsController.create);
Router.get('/tickets/all', Guards.auth, TicketsController.all);
Router.get('/tickets/self', Guards.auth, TicketsController.self);
Router.get('/tickets/statuses', Guards.auth, TicketsController.statuses);
Router.get('/tickets/types', Guards.auth, TicketsController.types);
Router.get('/tickets/:number', Guards.auth, TicketsController.ticket);
Router.put('/tickets/:number', Guards.auth, TicketsController.update);
Router.post('/tickets/fromUser', Guards.auth, TicketsController.fromUser);
/* Tickets */

/* News */
Router.get('/news/all', Guards.auth, NewsController.all);
Router.post('/news/comment', Guards.auth, NewsController.newComment);
Router.put('/news/:id/publish', Guards.auth, NewsController.publish);
Router.get('/news/:id', Guards.auth, NewsController.post);
Router.put('/news/:id', Guards.auth, Storage.shared.single('files'), NewsController.update);
Router.delete('/news/:id', Guards.auth, NewsController.remove);
Router.post('/news', Guards.auth, Storage.shared.single('files'), NewsController.create);
/* News */

/* Authorized user */ 
Router.get('/users/me', Guards.auth, UsersController.me);
Router.post('/users/me', Guards.auth, Storage.avatars.single('files'), UsersController.updateMe);
Router.post('/users/me/changePassword', Guards.auth, UsersController.changePassword);
Router.get('/users/me/contacts', Guards.auth, UsersController.contacts);
Router.get('/users/me/logs&reviews', Guards.auth, UsersController.selfLogsAndReviews);
Router.get('/users/me/bonuses&penalties', Guards.auth, UsersController.bonuses);
Router.get('/users/me/pricelists', Guards.auth, UsersController.pricelists);
Router.get('/users/me/txs', Guards.auth, UsersController.txs);
Router.get('/users/me/events', Guards.auth, UsersController.events);
Router.get('/users/me/balanceStatistics', Guards.auth, UsersController.balanceStatistics);
Router.get('/users/me/boosterStatistics', Guards.auth, UsersController.boosterStatistics);
Router.get('/users/me/payoutRequests', Guards.auth, UsersController.payoutRequests);
Router.post('/users/me/payoutRequests', Guards.auth, UsersController.newPayoutRequest);
/* Authorized user */ 

/* Users*/
Router.get('/users/payoff', Guards.auth, UsersController.payoffRequests);
Router.get('/users/payoff/:id', Guards.auth, UsersController.payoffRequest);
Router.delete('/users/payoff/:id', Guards.auth, UsersController.removePayoffRequests);
Router.put('/users/payoff/:id', Guards.auth, UsersController.updatePayoffRequests);
Router.get('/users/types', Guards.auth, UsersController.types);
Router.post('/users/types', Guards.auth, UsersController.typeCreate);
Router.get('/users/types/:id', Guards.auth, UsersController.type);
Router.put('/users/types/:id', Guards.auth, UsersController.typeUpdate);
Router.delete('/users/types/:id', Guards.auth, UsersController.typeDelete);
Router.put('/users/block', Guards.auth, UsersController.block);
Router.put('/users/approve', Guards.auth, UsersController.approve);
Router.get('/users/boosters/statistics', Guards.auth, UsersController.boostersStatistics);
Router.get('/users/boosters', Guards.auth, UsersController.boosters);
Router.get('/users/boosters/:id', Guards.auth, UsersController.booster);
Router.put('/users/boosters/:id', Guards.auth, Storage.avatars.single('files'), UsersController.boosterUpdate);
Router.post('/users/boosters', Guards.auth, Storage.avatars.single('files'), UsersController.boosterCreate);
Router.get('/users/clients', Guards.auth, UsersController.clients);
Router.get('/users/clients/:id', Guards.auth, UsersController.client);
Router.put('/users/clients/:id', Guards.auth, Storage.avatars.single('files'), UsersController.clientUpdate);
Router.post('/users/clients', Guards.auth, Storage.avatars.single('files'), UsersController.clientCreate);
Router.get('/users/boosters', Guards.auth, UsersController.boosters);
Router.get('/users/partners', Guards.auth, UsersController.partners);
Router.get('/users', Guards.auth, UsersController.all);
Router.get('/users/:id', Guards.auth, UsersController.user);
Router.put('/users/:id', Guards.auth, Storage.avatars.single('files'), UsersController.userUpdate);
Router.post('/users', Guards.auth, UsersController.create);
Router.delete('/users/:id', Guards.auth, UsersController.remove);
/* Users*/

/* Partners */
Router.get('/partners', Guards.auth, PartnersController.all);
Router.post('/partners', Guards.auth, Storage.avatars.single('files'), PartnersController.create);
Router.get('/partners/statistics', Guards.auth, PartnersController.statistics);
Router.put('/partners/block', Guards.auth, PartnersController.block);
Router.put('/partners/approve', Guards.auth, PartnersController.approve);
Router.get('/partners/keygen', Guards.auth, PartnersController.keygen);
Router.put('/partners/:id', Guards.auth, Storage.avatars.single('files'), PartnersController.partnerUpdate);
Router.get('/partners/:id', Guards.auth, PartnersController.partner);
Router.post('/partners/:id/pricelists/boost', Guards.auth, PartnersController.setPartnerBoostPricelist);
Router.delete('/partners/:id', Guards.auth, PartnersController.remove);
/* Partners */ 

Router.get('/*', (req, res, next) => {
	res.status(404).json('Requested address is not maintained.');
});

module.exports = Router;
