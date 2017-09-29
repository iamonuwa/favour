var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	contents: {
		type: Array,
		required: true
	},
	total: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		default: 'placed'
	},
	placedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);