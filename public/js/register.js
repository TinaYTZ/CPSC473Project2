/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: single, undef: true, unused: true, strict: true, trailing: true */
/* globals $:false, io:false */
var main = function() {
  'use strict';
  var socket = io.connect();

    var url = 'https://localhost:8080';
    $('#userArea').hide();
    // @param userCredentials - object of user register credentials
    function registerUser(userCredentials) {
        $.ajax({
            type: 'POST',
            url: url + '/register',
            contentType: 'application/json',
            dataType: 'json',
            data: (JSON.stringify(userCredentials)),
            success: function(response) {
							$('.signup-response').empty();
							$('.signup-response').append($('<p>' + response.response + '</p>'));
            }
        });
    }

    // @param userCredentials - object of user login credentials
    function loginUser(userCredentials) {
        $.ajax({
            type: 'POST',
            url: url + '/login',
            contentType: 'application/json',
            dataType: 'json',
            data: (JSON.stringify(userCredentials)),
            success: function(response) {
							$('.login-response').empty();
              $('.login-response').append($('<p>' + response.response + '</p>'));
              if(response.response === 'Successfully logged in'){
                $('#loginArea').hide();
                $('#login-modal').modal('hide');                
                $('#userArea').show();
                console.log('username', response.username);
                socket.emit('nickname', response.username, function (set) {
                    //we do not use set here, but in future may
                    $('#chat').addClass('nickname-set');
                    $('#nickname-err').css('visibility', 'visible');
                });
               

              }
            }
        });
    }

    $('#skip-register').click(function() {
        // POSTS user information if registration form passes validation rules
        $('#register-modal').modal('hide'); 
        $('#login-modal').modal('show');       
    });

    $('#register-submit-button').click(function() {
        // POSTS user information if registration form passes validation rules
        if ($('.ui.form.register').form('is valid')) {
            registerUser($('.ui.form.register').form('get values'));
        }
    });

    $('#login-submit-button').click(function() {
        // POSTS user information if registration form passes validation rules
        if ($('.ui.form.login').form('is valid')) {
            loginUser($('.ui.form.login').form('get values'));
        }
    });

    $('#register-button').click(function() {
        $('#register-modal').modal('show');
    });

    $('#login-button').click(function() {
        $('#login-modal').modal('show');
    });

		$('#skip-login').click(function() {

				$('#login-modal').modal('hide');
        $('#register-modal').modal('show'); 
		});

    $('.ui.form.register').form({
        fields: {
        	username: {
          		identifier : 'username',
          		rules: [
          			{
    	      			type : 'empty',
    	      			prompt : 'Please enter a username'
          			}
          		]
          	},
          	email: {
          		identifier : 'email',
          		rules: [
          			{
    	      			type : 'email' && 'empty',
    	      			prompt : 'Please enter a valid email'
          			}
          		]
          	},
          	confirmemail: {
          		identifier : 'confirm email',
          		rules: [
          			{
    	      			type : 'match[email]' && 'empty',
    	      			prompt : 'Emails must match'
          			}
          		]
          	},
          	password: {
          		identifier : 'password',
          		rules: [
          			{
    	      			type : 'empty',
    	      			prompt : 'Please enter a password'
          			}
          		]
          	},
          	confirmpassword: {
          		identifier : 'confirm password',
          		rules: [
          			{
    	      			type : 'match[password]' && 'empty',
    	      			prompt : 'Passwords must match'
          			}
          		]
          	},
        }
    });

    //Login Validation
    $('.ui.form.login').form({
        fields: {
        	username: {
          		identifier : 'username',
          		rules: [
          			{
    	      			type : 'empty',
    	      			prompt : 'Please enter a username'
          			}
          		]
          	},
          	password: {
          		identifier : 'password',
          		rules: [
          			{
    	      			type : 'empty',
    	      			prompt : 'Please enter your password'
          			}
          		]
          	},
        }
    });
};
$(document).ready(main);
