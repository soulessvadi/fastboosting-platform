module.exports = (db) => {

	const UsersController = {};

	UsersController.list = function(req, res, next) {
	    res.json({'status':200, 'users': [{'name':'savage'}]});
	};

	UsersController.user = function(req, res, next) {
	    res.json({'status':200, 'users': [{'name':'savage'}]});
	};

	UsersController.create = function(req, res, next) {
	    res.json({'status':200, 'users': [{'name':'savage'}]});
	};

	UsersController.update = function(req, res, next) {
	    res.json({'status':200, 'users': [{'name':'savage'}]});
	};

	UsersController.remove = function(req, res, next) {
	    res.json({'status':200, 'users': [{'name':'savage'}]});
	};

	return UsersController;

};