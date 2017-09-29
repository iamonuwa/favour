var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	short_name: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	special_instructions: {
		type: String
	}
});

var Categories = mongoose.model('Category', categorySchema);

module.exports = Categories;