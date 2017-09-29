var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuItemsSchema = new Schema({
	category_id: {
		type: String,
		required: true
	},
	short_name: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price_small: {
		type: Number
	},
	price_large: {
		type: Number,
		required: true
	},
	small_portion_name: {
		type: String
	},
	large_portion_name: {
		type: String
	}
}, {timestamps: true});

var MenuItems = mongoose.model('MenuItem', menuItemsSchema);

module.exports = MenuItems;
