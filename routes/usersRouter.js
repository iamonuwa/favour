var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

var userRouter = express.Router();

// get all user info (admin only)
userRouter.get('/', Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
	User.find({}, function(err, user){
	  	if(err) console.log('Something wrong with user.find');
	  	res.json(user);
	 });
});

// create new user (all)
userRouter.post('/register', function(req, res){
	User.register(new User({username: req.body.username}),
	req.body.password, function(err, user){
		if(err){
			return res.status(500).json({err: err});
		}
		user.save(function(err, user){
			passport.authenticate('local')(req, res, function(){
				return res.status(200).json({status: 'Sign Up Successfully!'});
			});
		});
	});
});

// user login and logout
userRouter.post('/login', function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err) {
			return next(err);
		}
		if(!user) {
			return res.status(401).json({
				status: 'Incorrect information',
				msg: 'The username or password you entered was incorrect.'
			});
		}
		req.logIn(user, function(err){
			if(err) {
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}
			console.log('User in users: ', user);

			// generate token
			var token = Verify.getToken(user);

			res.status(200).json({
				status: 'Login Successful',
				msg: 'You have logged in successfully!',
				success: true,
				token: token,
				user: user
			});
		});
	})(req, res, next);
});

userRouter.get('/logout', function(req, res){
	req.logout();
	res.status(200).json({
		status: 'Bye!'
	});
	// should also destroy the token
});

module.exports = userRouter;