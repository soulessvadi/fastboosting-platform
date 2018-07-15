const Router = require('express').Router();
const db = require('./models/sequelize').connection; 
const Controllers = require('./controllers/controller.api.js');
const BaseController = require('./controllers/controller.base.js')(db);
const UsersController = require('./controllers/controller.users.js')(db);

Router.use(Controllers.init);
Router.get('/', BaseController.info);
Router.get('/users', UsersController.list);
Router.get('/users/:id', UsersController.user);
Router.post('/users', UsersController.create);
Router.put('/users/:id', UsersController.update);
Router.delete('/users/:id', UsersController.remove);

Router.get('/:controller/:action', (req, res, next) => {
	let Controller = Controllers[req.params.controller] || null;
	let Action = Controller ? Controller[req.params.action] : null;
	if(typeof Action === 'function') {
		Action(req, res, next);
	} else {
		if(req.app.get('env') === 'production') {
			res.status(404).json('Requested address is not maintained.');
		} else {
			res.status(404).json(Controller
			? `<h5 style="color:#686868;font:500 24px 'Verdana';">Action <strong style="color:coral;">&laquo${req.params.action}&raquo</strong> not declared.<h5>`
			: `<h5 style="color:#686868;font:500 24px 'Verdana';">Controller <strong style="color:coral;">&laquo${req.params.controller}&raquo</strong> not found.<h5>`);
		}
	}
});

Router.get('/*', (req, res, next) => {
	res.status(404).json('Requested address is not maintained.');
});

module.exports = Router;
