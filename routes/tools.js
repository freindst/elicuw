var express = require('express');
var router = express.Router();

//export global functions
module.exports = function() {
	//middleware: check whether current client has logged in the system. If not, jump to login page.
	this.isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			req.session.error_message = "Please login first to use the system.";
			req.session.returnTo = req.originalUrl;
			res.redirect('/login');
		}
	};

	//middleware: check whether the user has been verified. If not, jump back to homepage.
	this.isVerified = function(req, res, next) {
		var user = req.user[0];
		if (user.isVerified == '1') {
			next();
		} else {
			req.session.error_message = "Please wait for administrator verifying your account, or contact administrator right now.";
			res.redirect('/');
		}
	}

	//middleware: check whether the user is admin. if not, reject the request and go back to orginal screen.
	this.isAdmin = function(req, res, next) {
		var user = req.user[0];
		if ((user.User_group == 'admin' ) || (user.User_group == 'super_user' )) {
			next();
		} else {
			req.session.error_message = "Sorry. Only administrator is allowed to access this funciton.";
			res.redirect('/');
		}
	}


	//group user info passing, messages display and screen render together
	this.renderScreen = function(req, res, view, options) {
/*		var options = {
			title: 'Home',
			url: '/'
		}*/
		//if user has logged in, assign req.user[0] to variable user
		if (req.isAuthenticated()) {
			options.user = req.user[0];
		}
		//if previous page has passed a meesage in session, render it.
		if (req.session.hasOwnProperty('okay_message')) {
			options.okay_message = req.session.okay_message;
			delete req.session.okay_message;
		}
		//if previous page has passed an error meesage in session, render it.
		if (req.session.hasOwnProperty('error_message')) {
			options.error_message = req.session.error_message;
			delete req.session.error_message;
		}
		res.render(view, options)
	}
	
};