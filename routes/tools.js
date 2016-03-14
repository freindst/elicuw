var express = require('express');
var router = express.Router();

module.exports = function() {
	this.isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			req.session.error_message = "Please login first to use the system.";
			res.redirect('/login');
		}
	};

	
};