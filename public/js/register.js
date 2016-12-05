var main = function() {
	'use strict'

	var url = "https://localhost:8080";
	var redirect;

	// @param userCredentials - object of user register credentials
	function registerUser(userCredentials) {
		$.ajax({
			type: 'POST',
			url: url + '/register',
			contentType: 'application/json',
			dataType: 'json',
			data:	(JSON.stringify(userCredentials)),
			success: function(response) {
				window.location = url + response['redirect'];
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
			data:	(JSON.stringify(userCredentials)),
			success: function(response) {
				console.log(response);
			}
		});
	}

	$('#register-submit-button').click(function() {
		 console.log($('.ui.form.register').form('get values'));
		 // POSTS user information if registration form passes validation rules
		 if($('.ui.form.register').form('is valid')) {
		 	console.log('The registration form fields are valid');
		 	registerUser($('.ui.form.register').form('get values'));
		 } else {
		 	console.log('The registration form fields are invalid');
		 }
	});

	$('#login-submit-button').click(function() {
		 console.log($('.ui.form.login').form('get values'));
		 // POSTS user information if registration form passes validation rules
		 if($('.ui.form.login').form('is valid')) {
			console.log('The login credentials are VALID');
			loginUser($('.ui.form.login').form('get values'));
		 } else {
			console.log('The login credentials are INVALID');
		 }
	});

	$('#register-button').click(function() {
		$('#register-modal').modal('show');
	});

	$('#login-button').click(function() {
		$('#login-modal').modal('show');
	});

	$('#skip').click(function() {
		$('#register-modal').modal('show');
	});

	// Register form validation rules - this can be moved to a different file
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
	})

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
	})
};
$(document).ready(main);
