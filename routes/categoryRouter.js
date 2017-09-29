var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Categories = require('../models/categories');
var Verify = require('./verify');

var categoryRouter = express.Router();

categoryRouter.route('/')
	// get the list of all categories (all users)
	.get(function(req, res, next){
		Categories.find({}, function(err, categories){
			if(err) console.log('Something wrong with Categories.find');
			res.json(categories);
		});
	})
	// create new category (admin only)
	.post(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		Categories.create(req.body, function(err, category){
			if(err) console.log('Something wrong with Categories.create');
			console.log('Category created!');
			res.json(category);
		});
	});

categoryRouter.route('/:categoryId')
	// get a single category by its id (all users)
	.get(function(req, res, next){
		Categories.findById(req.params.categoryId, function(err, category){
			if(err) console.log('Something wrong with Categories.findById');
			res.json(category);
		});
	})
	// update a specific category (admin only)
	.put(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		Categories.findByIdAndUpdate(
			req.params.categoryId,
			{$set: req.body},
			{new: true},
			function(err, category){
				if(err) console.log('Something wrong with Categories.findByIdAndUpdate');
				res.json(category);
			});
	})
	// delete a specific category (admin only)
	.delete(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		Categories.findByIdAndRemove(req.params.categoryId, function(err, resp){
			if(err) console.log('Something wrong with Categories.findByIdAndRemove');
			res.json(resp);
		});
	});

module.exports = categoryRouter;