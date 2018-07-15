const db = require('./app/models/sequelize').connection;
const schemas = require('./app/models/schemas');
const md5 = require('md5');

(async () => {
	await db.sync({force:true, logging: console.log});
	await schemas.User.bulkCreate([
		{login: 'savage77', password: md5('111111'), first_name:'Voodoo', last_name:'Savage', nick_name:'savage 77', type: 1},
		{login: 'savage88', password: md5('111111'), first_name:'Voodoo', last_name:'Savage', nick_name:'savage 88', type: 1}
	]);
	process.exit();
})();
