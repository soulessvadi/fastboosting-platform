const db = require('../models/sequelize').connection; 
exports.init = function(req, res, next) {
     next();
};
exports.users = require('./controller.users.js')(db);
exports.base = require('./controller.base.js')(db);
