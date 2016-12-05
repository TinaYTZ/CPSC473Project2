// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: single, undef: true, unused: true, strict: true, trailing: true */

'use strict';
var express = require('express');
var https = require('https');
var multidep = require('multidep')('multidep.json');
var fs = require('fs');
var events = require('events');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var bodyParser = require('body-parser');
var port = 8080;
var ssldir = 'node_modules/socketio-over-nodejs/fake-keys'
var options = {
   key: fs.readFileSync(ssldir + '/privatekey.pem'),
   cert: fs.readFileSync(ssldir + '/certificate.pem')
};
var socketio = multidep('socket.io', '0.9.17');

var stat = require('node-static');
var path = require('path');

var app = express();
<<<<<<< HEAD
var nicknames = {};
=======
>>>>>>> refs/remotes/origin/master

// Body Parser for JSON
app.use(bodyParser.json());

<<<<<<< HEAD
var server = https.createServer(options,app);
app.use('/', express.static('public'));

var file = new stat.Server(path.join(__dirname, '..', 'public'));

  function handler(req, res) {
    file.serve(req, res);
  }
=======
var server = https.createServer(options, app);
app.use('/', express.static('public'));
>>>>>>> refs/remotes/origin/master

// Connect to the database
mongoose.connect('mongodb://project2:project2@ds113668.mlab.com:13668/473project2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to mlab Project 2 Database");
});

//Express Validator - Taken from express-validator documentation
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Register User - gets data from the user end and validates it
app.post('/register', function(req, res) {
<<<<<<< HEAD
  var email = req.body.email,
        username = req.body.username,
          password = req.body.password,
          password2 = req.body.password2; // For confirm password field

      // Validation using express-validator
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('username', 'Invalid username').notEmpty();
        req.checkBody('password', 'Invalid password').notEmpty();
        req.checkBody('password2', 'Invalid password').equals(req.body.password);

        // Test for errors example - delete the console logs later
        var errors = req.validationErrors();

        // Re-render the register page with the errors
        if(errors) {
      res.send('errors in register validation');
      console.log('errors in registering' + errors);
        } else {
            console.log('Registration passed for email: ' + email + 'name: ' + username);
            //validation passed so lets create our new user
            var newUser = new User( {
                email: email,
              username: username,
                password: password
            });

      // Create our user - throw an error if it fails
            User.createUser(newUser, function(err, user) {
                if(err) throw err;
                    console.log(user);
            });
        }
=======
  console.log('Form data sent: ' + req.body.email + req.body.confirmemail + req.body.username + req.body.password + req.body.confirmpassword)
  var email = req.body.email,
	    username = req.body.username,
		  password = req.body.password;

    // Validation using express-validator
		req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('confirmemail', 'Invalid email').equals(req.body.email);
		req.checkBody('username', 'Invalid username').notEmpty();
		req.checkBody('password', 'Invalid password').notEmpty();
		req.checkBody('confirmpassword', 'Invalid password').equals(req.body.password);

		// Test for errors example - delete the console logs later
		var errors = req.validationErrors();

		// Re-render the register page with the errors
		if(errors) {
      res.send('errors in register validation');
      console.log('errors in registering' + errors);
		} else {
			console.log('Registration passed for email: ' + email + 'name: ' + username);
			//validation passed so lets create our new user
			var newUser = new User( {
			    email: email,
		      username: username,
			    password: password
			});

      // Create our user - throw an error if it fails
			User.createUser(newUser, function(err, user) {
				if(err) throw err;
					console.log(user);
			});
		}
>>>>>>> refs/remotes/origin/master
});

// Gets user name, checks for match in our db, validates the password
// Functions comparePassword & getUserByUsername found in models/user.js
passport.use(new LocalStrategy(
  function(username, password, done) {
<<<<<<< HEAD
    User.getUserByUsername(username), function(err, user) {
        if(err) throw err;

        // Is there a user in our db?
        if(!user) {
            return done(null, false, {message: 'No User Found'});
        }

      // Does password match?
        User.comparePassword(password, user.password, function(err, isMatch) {
            if(err) throw err;
            if(isMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, {message: 'Invalid Password'});
            }
        });
    };
    }));
=======
  	User.getUserByUsername(username), function(err, user) {
  		if(err) throw err;

  		// Is there a user in our db?
  		if(!user) {
  			return done(null, false, {message: 'No User Found'});
  		}

      // Does password match?
  		User.comparePassword(password, user.password, function(err, isMatch) {
  			if(err) throw err;
  			if(isMatch) {
  				return done(null, user);
  			}
  			else {
  				return done(null, false, {message: 'Invalid Password'});
  			}
  		});
  	};
	}));
>>>>>>> refs/remotes/origin/master

// Passport serialization
//Taken from official passport docs - getUserById found in our schema
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
<<<<<<< HEAD
    User.getUserbyId(id, function(err, user) {
        done(err, user);
    });
});



//io.set('transports', [ /*'websocket',*/ 'xhr-polling', 'jsonp-polling' ]);
//video
=======
	User.getUserbyId(id, function(err, user) {
		done(err, user);
	});
});

>>>>>>> refs/remotes/origin/master
var io = socketio.listen(server, {
    log: true,
    origins: '*:*'
});

var channels = {};

io.sockets.on('connection', function (socket) {
    var initiatorChannel = '';
    if (!io.isConnected) {
        io.isConnected = true;
    }



    socket.on('new-channel', function (data) {
        if (!channels[data.channel]) {
            initiatorChannel = data.channel;
        }

        channels[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
    });

    socket.on('presence', function (channel) {
        var isChannelPresent = !! channels[channel];
        socket.emit('presence', isChannelPresent);
    });



    socket.on('disconnect', function (channel) {
        if (initiatorChannel) {
            delete channels[initiatorChannel];
        }
         if (!socket.nickname) {

        return;
       }
      delete nicknames[socket.nickname];
      socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
      socket.broadcast.emit('nicknames', nicknames);
        });

//chat 
    socket.on('nickname', function (nick, fn) {
      console.log("get nick",nick);
      if (nicknames[nick]) {
        fn(true);
      }
      else {
        fn(false);
        nicknames[nick] = socket.nickname = nick;
        socket.broadcast.emit('announcement', nick + ' connected');
        io.sockets.emit('nicknames', nicknames);
      }
    });
     socket.on('user message', function (msg) {
      socket.broadcast.emit('user message', socket.nickname, msg);
    });

    socket.on('user image', function (msg) {
      console.log(msg);
      socket.broadcast.emit('user image', socket.nickname, msg);
    });

});


 


function onNewNamespace(channel, sender) {
    io.of('/' + channel).on('connection', function (socket) {
        var username;
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            if (data.sender == sender) {
                if(!username) username = data.data.sender;

                socket.broadcast.emit('message', data.data);
            }
        });

        socket.on('disconnect', function() {
            if(username) {
                socket.broadcast.emit('user-left', username);
                username = null;
            }
        });
    });
}

server.listen(process.env.PORT || port, function() {
  console.log("Express running on port", (process.env.PORT || port));
});