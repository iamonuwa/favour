var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	admin: {
		type: Boolean,
		default: true
	},
	location: {
		type: String,
		required: true
	}
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);