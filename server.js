// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: single, undef: true, unused: true, strict: true, trailing: true */

'use strict';
var express = require('express');
var https = require('https');
var multidep = require('multidep')('multidep.json');
var socketio = multidep('socket.io', '0.9.17');
var newsocketio = multidep('socket.io', '1.7.1');
var fs = require('fs');
var events = require('events');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var port = 8080;
var ssldir = 'node_modules/socketio-over-nodejs/fake-keys'
var options = {
   key: fs.readFileSync(ssldir + '/privatekey.pem'),
   cert: fs.readFileSync(ssldir + '/certificate.pem')
};

var app = express();
app.use('/', express.static('public'))
var server = https.createServer(options, app);

// Connect to the database
mongoose.connect('mongodb://project2:project2@ds113668.mlab.com:13668/473project2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to mlab Project 2 Database");
});

var io = socketio.listen(server, {
    log: true,
    origins: '*:*'
});

//io.set('transports', [ /*'websocket',*/ 'xhr-polling', 'jsonp-polling' ]);

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
