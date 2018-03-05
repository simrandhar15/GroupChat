//Import Mongoose
var mongoose = require('mongoose')

var Message = mongoose.model('Message', {
	name: String,
	email: String,
	message: String,
	image: String,
	time: String,
})

module.exports = Message