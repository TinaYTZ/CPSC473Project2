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
var User = require('./models/user');
var bodyParser = require('body-parser');
var port = 8080;
var ssldir = 'node_modules/socketio-over-nodejs/fake-keys';
var options = {
    key: fs.readFileSync(ssldir + '/privatekey.pem'),
    cert: fs.readFileSync(ssldir + '/certificate.pem')
};
var socketio = multidep('socket.io', '0.9.17');

var stat = require('node-static');
var path = require('path');

var app = express();
var nicknames = {};

// Body Parser for JSON
app.use(bodyParser.json());

var server = https.createServer(options, app);
app.use('/', express.static('public'));

var file = new stat.Server(path.join(__dirname, '..', 'public'));

function handler(req, res) {
    file.serve(req, res);
}

// Connect to the database
mongoose.connect('mongodb://project2:project2@ds113668.mlab.com:13668/473project2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to mlab Project 2 Database');
});

//Express Validator - Taken from express-validator documentation
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Register User - gets data from the user end and validates it
app.post('/register', function(req, res) {
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

    if (errors) {
        res.json({
            'response': 'Errors in registering'
        });
        console.log('errors in registering' + errors);
    } else {
        res.json({
            'response': 'Successfully signed up!'
        });
        //validation passed so lets create our new user
        var newUser = new User({
            email: email,
            username: username,
            password: password
        });

        // Create our user - throw an error if it fails
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });
    }
});

app.post('/login', function(req, res) {
            var username = req.body.username,
                password = req.body.password;

            req.checkBody('username', 'Invalid Username').notEmpty();
            req.checkBody('password', 'Invalid password').notEmpty();

            var errors = req.validationErrors();

            if (errors) {
                // This shouldn't be called because of client side validation
                res.json({
                    'response': 'Enter a username and password'
                });
                console.log('Validation errors: ' + errors);
            } else {
                User.findOne({
                    username: username
                }, function(err, user) {
                    if (err) throw err;

                    // Is there a user in our db?
                    else if (!user) {
                        res.json({
                            'response': 'User was not found'
                        });
                    } else {
                        // Load hash from your password DB.
                        User.comparePassword(password, user.password, function(err, user) {
                            if (err) {
                                res.json({
                                    'response': 'Invalid password'
                                });
                            } else {
                                res.json({
                                    'response': 'Successfully logged in',
                                    'username': username
                                });
                            }
                        });
                    }
                });
            };
        });

        //io.set('transports', [ /*'websocket',*/ 'xhr-polling', 'jsonp-polling' ]);
        //video
        var io = socketio.listen(server, {
            log: true,
            origins: '*:*'
        });

        var channels = {};

        io.sockets.on('connection', function(socket) {
            var initiatorChannel = '';
            if (!io.isConnected) {
                io.isConnected = true;
            }

            socket.on('new-channel', function(data) {
                if (!channels[data.channel]) {
                    initiatorChannel = data.channel;
                }

                channels[data.channel] = data.channel;
                onNewNamespace(data.channel, data.sender);
            });

            socket.on('presence', function(channel) {
                var isChannelPresent = !!channels[channel];
                socket.emit('presence', isChannelPresent);
            });



            socket.on('disconnect', function(channel) {
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
            socket.on('nickname', function(nick, fn) {
                console.log('get nick', nick);
                if (nicknames[nick]) {
                    fn(true);
                } else {
                    fn(false);
                    nicknames[nick] = socket.nickname = nick;
                    socket.broadcast.emit('announcement', nick + ' connected');
                    io.sockets.emit('nicknames', nicknames);
                }
            });
            socket.on('user message', function(msg) {
                socket.broadcast.emit('user message', socket.nickname, msg);
            });

            socket.on('user image', function(msg) {
                console.log(msg);
                socket.broadcast.emit('user image', socket.nickname, msg);
            });

        });

        function onNewNamespace(channel, sender) {
            io.of('/' + channel).on('connection', function(socket) {
                var username;
                if (io.isConnected) {
                    io.isConnected = false;
                    socket.emit('connect', true);
                }

                socket.on('message', function(data) {
                    if (data.sender == sender) {
                        if (!username) username = data.data.sender;

                        socket.broadcast.emit('message', data.data);
                    }
                });

                socket.on('disconnect', function() {
                    if (username) {
                        socket.broadcast.emit('user-left', username);
                        username = null;
                    }
                });
            });
        }

        server.listen(process.env.PORT || port, function() {
            console.log("Express running on port", (process.env.PORT || port));
        });
