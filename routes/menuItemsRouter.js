var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var MenuItems = require('../models/menuItems');
var Verify = require('./verify');

var menuItemsRouter = express.Router();

menuItemsRouter.route('/')
	// without query -> get a list of all menu items (all users)
	// with query -> get menu items under a category by category's shortName (all users)
	.get(function(req, res, next){
		MenuItems.find(req.query, function(err, menuItems){
			if(err) console.log('Something wrong with menu_items?category=XX');
			res.json(menuItems);
		});
	})
	// post a new menu item (admin only)
	.post(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		MenuItems.create(req.body, function(err, menuItem){
			if(err) console.log('Something wrong with MenuItems.create');
			console.log('Menu item created!');
			res.json(menuItem);
		});
	});

menuItemsRouter.route('/:shortName')
	// get one menu item by its shortName (all users)
	.get(function(req, res, next){
		MenuItems.find({short_name: req.params.shortName}, function(err, menuItems){
			if(err) console.log('Something wrong with MenuItems.get:shortName');
			res.json(menuItems);
		});
	});

menuItemsRouter.route('/:menuItemId')
	// // get one menu item by its id (admin?)
	// .get(function(req, res, next){
	// 	MenuItems.findById(req.params.menuItemId, function(err, menuItem){
	// 		if(err) console.log('Something wrong with MenuItems.findById');
	// 		console.log(1);
	// 		res.json(menuItem);
	// 	});
	// })
	// update a menu item (admin only)
	.put(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		MenuItems.findByIdAndUpdate(
			req.params.menuItemId,
			{$set: req.body},
			{new: true}, 
			function(err, menuItem){
				if(err) console.log('Something wrong with MenuItems.findByIdAndUpdate');
				res.json(menuItem);
			});
	})
	// delete a menu item (admin only)
	.delete(Verify.verifyUser, Verify.verifyAdmin, function(req, res, next){
		MenuItems.findByIdAndRemove(req.params.menuItemId, function(err, resp){
			if(err) console.log('Something wrong with MenuItems.findByIdAndRemove');
			res.json(resp);
		});
	});

module.exports = menuItemsRouter;