module.exports = (db) => {

	const BaseController = {};

	BaseController.info = (req, res, next) => {
	     res.send({'version':'1.0', 'stage': req.app.get('env')});
	};

	return BaseController;

};