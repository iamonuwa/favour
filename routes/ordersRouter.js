var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Orders = require('../models/orders');

var Verify = require('./verify');

var ordersRouter = express.Router();

ordersRouter.route('/')
	// get a list of all orders (admin only)
	.get(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		Orders.find({status: 'complete'}, function(err, orders){
			if(err) console.log('Something wrong with Orders.find');
			res.json(orders);
		}).sort({createdAt: -1});
	});

ordersRouter.route('/incoming')
	// get a list of incoming orders (admin only)
	.get(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		Orders.find({status: {$ne: 'complete'}}, function(err, orders){
			if(err) console.log('Something wrong with Orders.find incoming');
			res.json(orders);
		}).sort({createdAt: -1});
	});

ordersRouter.route('/:userId')
	// view order list of a specific user (user + admin)
	.get(Verify.verifyUser, function(req, res, next){
		Orders.find({placedBy: req.params.userId}, function(err, orders){
			if(err) console.log('Something wrong with Orders.find({placedBy: req.params.userId}');
			res.json(orders);
		}).limit(10).sort({createdAt: -1});
	})
	// place new order (user)
	.post(Verify.verifyUser, function(req, res, next){
		req.body.placedBy = req.decoded._doc._id;
		Orders.create(req.body, function(err, order){
			if(err) console.log('Something wrong with Orders.create');
			res.json(order);
		});
	});

ordersRouter.route('/:userId/:orderId')
	// view an order from a specific user (user + admin)
	.get(Verify.verifyUser, function(req, res, next){
		Orders.findById(req.params.orderId, function(err, order){
			if(err) console.log('Something wrong with Orders.findById');
			res.json(order);
		});
	})
	// update a specific order (user + admin)
	.put(Verify.verifyUser, function(req, res, next){
		Orders.findByIdAndUpdate(
			req.params.orderId,
			{$set: req.body},
			{new: true}, 
			function(err, order){
			if(err) console.log('Something wrong with Orders.findByIdAndUpdate');
			res.json(order);
		});
	});


module.exports = ordersRouter;