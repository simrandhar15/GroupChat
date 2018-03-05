var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	local            : {
        email        : String,
        password     : String,
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        image        : String,
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
