var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

exports.getToken = function(user){
	return jwt.sign(user, config.secretKey, {
		expiresIn: 3600
	});
};

exports.verifyUser = function(req, res, next){
	// check and aquire token from request
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if(token){
		jwt.verify(token, config.secretKey, function(err, decoded){
			if(err){
				var err = new Error('You are not authenticated!');
				err.status = 401;
				return next(err);
			} else {
				// this will load a new property named decoded to the request object
				req.decoded = decoded; 
				// proceed to verifyAdmin if required
				next();
			}
		});
	} else {
		// if there is no token, return an error
		var err = new Error('No token provided!');
		err.status = 403;
		return next(err);
	}
};

exports.verifyAdmin = function(req, res, next){
	if(req.decoded._doc.admin){
		next();
	} else {
		var err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		return next(err);
	}
};