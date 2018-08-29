const Utils = require('./helpers');
module.exports = function(req, res, next) {
	let bearer = req.get('Authorization') || null;
	if(bearer) {
		let token = bearer; //bearer.split(' ').pop();
		let user = Utils.jwtVerify(token);
		if(user) { 
			user.order_permissions = JSON.parse(user.order_permissions);
			req.app.user = user; 
			return next();
		}
	} 
	res.status(401).json({'error':'unauthorized'});
}