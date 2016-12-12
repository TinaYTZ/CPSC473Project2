/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: single, undef: true, unused: true, strict: true, trailing: true */
/* global $:false, io:false */
//
  // socket.io code
  //
'use strict';   


$('.btn-minimize').click(function(){
    $(this).toggleClass('btn-plus');
    $('.messgeArea').slideToggle();
  });

  function message (from, msg) {
    $('#lines').append($('<p>').append($('<b>').text(from), msg));
  }

  function image (from, base64Image) {
    $('#lines').append($('<p>').append($('<b>').text(from), '<img src="' + base64Image + '"/>'));
  }

  var socket = io.connect();
  //$('#mainArea').hide();
  socket.on('connect', function () {
    $('#chat').addClass('connected');
  });

  socket.on('announcement', function (msg) {
    $('#lines').append($('<p>').append($('<em>').text(msg)));
  });

  socket.on('nicknames', function (nicknames) {
    $('#nickname').hide();
    $('#mainArea').show();

    $('#nicknames').empty().append($('<span>Online: </span>'));
    for (var i = 0; i < nicknames.length; i++) {
      $('#nicknames').append($('<b>').text(nicknames[i]));
    }
  });

  socket.on('user message', message);
  socket.on('user image', image);
  socket.on('reconnect', function () {
    $('#lines').remove();
    message('System', 'Reconnected to the server');
  });

  socket.on('reconnecting', function () {
    message('System', 'Attempting to re-connect to the server');
  });

  socket.on('error', function (e) {
    message('System', e ? e : 'A unknown error occurred');
  });

  //
  // dom manipulation code
  //
    function clear() {
      $('#message').val('').focus();
    }

    $('#send-message').submit(function () {
      message('me', $('#message').val());
      socket.emit('user message', $('#message').val());
      clear();
      $('#lines').get(0).scrollTop = 10000000;
      return false;
    });

    $('#imagefile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        image('me', evt.target.result);
        socket.emit('user image', evt.target.result);
      };
      reader.readAsDataURL(data);
      
    });
