const Router = require('express').Router();
const Connection = require('./models/sequelize').connection;
const Controllers = require('./controllers/controller.api.js');
const BaseController = require('./controllers/controller.base.js')(Connection);
const UsersController = require('./controllers/controller.users.js')(Connection);
const IntefaceController = require('./controllers/controller.interface.js')(Connection);

Router.use(Controllers.init);
Router.get('/', BaseController.info);
Router.get('/interface', IntefaceController.get);

/* Users*/
Router.get('/users', UsersController.list);
Router.get('/users/:id', UsersController.user);
Router.post('/users', UsersController.create);
Router.put('/users/:id', UsersController.update);
Router.delete('/users/:id', UsersController.remove);
/* Users*/

Router.get('/*', (req, res, next) => {
	res.status(404).json('Requested address is not maintained.');
});

module.exports = Router;
