exports.init = (req, res, next) => {
	  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-CSRF, X-XSRF-TOKEN");
	  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    next();
};
