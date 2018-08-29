const Router = require('express').Router();
const Connection = require('./models/sequelize').connection;
const Controllers = require('./controllers/controller.api.js');
const BaseController = require('./controllers/controller.base.js')(Connection);
const UsersController = require('./controllers/controller.users.js')(Connection);
const IntefaceController = require('./controllers/controller.interface.js')(Connection);
const OrdersController = require('./controllers/controller.orders.js')(Connection);
const TicketsController = require('./controllers/controller.tickets.js')(Connection);
const NewsController = require('./controllers/controller.news.js')(Connection);
const Utils = require('./utils/helpers');
const AuthGuard = require('./utils/authguard');
const Storage = require('./utils/storage');

Router.use(Controllers.init);

/* Public methods */
Router.post('/register', UsersController.register);
Router.post('/authorize', UsersController.authorize);
Router.post('/recovery', UsersController.recovery);
/* Public methods */

Router.get('/', BaseController.info);
Router.get('/interface', AuthGuard, IntefaceController.get);
Router.get('/interface/menu', AuthGuard, IntefaceController.menu);
Router.get('/interface/translate', IntefaceController.translate);
Router.get('/interface/translations', IntefaceController.translations);
Router.post('/interface/translations', IntefaceController.translationsU);
Router.get('/interface/heroes', IntefaceController.heroes);
Router.get('/interface/servers', IntefaceController.servers);
Router.get('/interface/lanes', IntefaceController.lanes);
Router.get('/interface/countries', IntefaceController.countries);
Router.get('/interface/paymethods', IntefaceController.paymethods);

/* Orders */
Router.get('/orders/all', AuthGuard, OrdersController.all);
Router.get('/orders/problematic', AuthGuard, OrdersController.problematic);
Router.get('/orders/pending', AuthGuard, OrdersController.accessible);
Router.get('/orders/history', AuthGuard, OrdersController.history);
Router.get('/orders/active', AuthGuard, OrdersController.active);
Router.get('/orders/:number', AuthGuard, OrdersController.order);
Router.post('/orders/:number', AuthGuard, OrdersController.orderUpdate);
Router.post('/orders/active/issue', AuthGuard, OrdersController.issue);
Router.post('/orders/active/report', AuthGuard, Storage.screenshots.any('files[]'), OrdersController.report);
Router.post('/orders/active/workerStatus', AuthGuard, OrdersController.workerStatus);
Router.post('/orders/active/setDotabuff', AuthGuard, OrdersController.setDotabuff);
Router.post('/orders/active/cancelOrder', AuthGuard, OrdersController.cancelOrder);
Router.post('/orders/joinOrder', AuthGuard, OrdersController.joinOrder);
/* Orders */

/* Tickets */
Router.get('/tickets/all', AuthGuard, TicketsController.all);
Router.get('/tickets/self', AuthGuard, TicketsController.self);
Router.get('/tickets/statuses', AuthGuard, TicketsController.statuses);
Router.get('/tickets/types', AuthGuard, TicketsController.types);
Router.get('/tickets/:number', AuthGuard, TicketsController.ticket);
Router.post('/tickets/:number', AuthGuard, TicketsController.ticketUpdate);
Router.post('/tickets/new', AuthGuard, TicketsController.new);
/* Tickets */

/* Tickets */
Router.post('/news/comment', AuthGuard, NewsController.newComment);
/* Tickets */

/* Users*/
Router.get('/users/me', AuthGuard, UsersController.me);
Router.post('/users/me', AuthGuard, Storage.avatars.single('files'), UsersController.updateMe);
Router.post('/users/me/changePassword', AuthGuard, UsersController.changePassword);
Router.get('/users/me/contacts', AuthGuard, UsersController.contacts);
Router.get('/users/me/logs&reviews', AuthGuard, UsersController.selfLogsAndReviews);
Router.get('/users/me/bonuses&penalties', AuthGuard, UsersController.bonuses);
Router.get('/users/me/pricelists', AuthGuard, UsersController.pricelists);
Router.get('/users/me/txs', AuthGuard, UsersController.txs);
Router.get('/users/me/events', AuthGuard, UsersController.events);
Router.get('/users/me/balanceStatistics', AuthGuard, UsersController.balanceStatistics);
Router.get('/users/me/boosterStatistics', AuthGuard, UsersController.boosterStatistics);
Router.get('/users/me/payoutRequests', AuthGuard, UsersController.payoutRequests);
Router.post('/users/me/payoutRequests', AuthGuard, UsersController.newPayoutRequest);
Router.get('/users', AuthGuard, UsersController.list);
Router.get('/users/:id', AuthGuard, UsersController.user);
Router.post('/users', AuthGuard, UsersController.create);
Router.put('/users/:id', AuthGuard, UsersController.update);
Router.delete('/users/:id', AuthGuard, UsersController.remove);
/* Users*/

Router.get('/*', (req, res, next) => {
	res.status(404).json('Requested address is not maintained.');
});

module.exports = Router;
