var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
      email: String,
      username: String,
      password: String,
      password2: String
    });

var User = module.exports = mongoose.model('User', UserSchema);

// Hash our password in the db
module.exports.createUser = function(newUser, callback) {
	// Following code copied directly from bcryptjs documentation
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			// Store hash in password DB & save it
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

// Find user by username in our db
module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
};

// Find user by object id in our db
module.exports.getUserById = function(username, callback) {
	User.findById(id, callback);
};

// Find password
module.exports.comparePassword = function(inputPassword, hash, callback) {
	//Load hash password - taken from documentation
	bcrypt.compare(inputPassword, hash, function(err, res) {
		if(err) throw err;
		callback(null, res);
	});
};