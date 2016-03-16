var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A Router-level middleware check user's authentication before using it
router.use(function (req, res, next) {
	isAuthenticated(req, res, next);
});

router.get('/', function(req, res) {

});

/* GET users listing. */
router.get('/userlist', isVerified, isAdmin, function(req, res) {
	var query1 = "SELECT * FROM Users";
	var query2 = "SELECT COUNT(*) AS NumberOfUser FROM Users WHERE isVerified = 0";

	connection.query(query1, function(err, results) {
		if (err) throw err;

		connection.query(query2, function(err, count) {
			if (err) throw err;

			renderScreen(req, res, 'users/userlist', {
				title: 'User List',
				users: results,
				count: count[0].NumberOfUser
			});  		
		});
	});
});

router.get('/unverifiedUsers', isVerified, isAdmin, function(req, res) {
	var query = "SELECT * FROM Users WHERE isVerified = 0";
	connection.query(query, function (err, results) {
		if (err) throw err;

		renderScreen(req, res, 'users/unverifiedUsers', {
			title: 'unverified User List',
			users: results
		});
	});
});

router.get('/changeStatus/:userid/:isVerified', isVerified, isAdmin, function(req, res) {
	var query = "UPDATE Users SET isVerified = ? WHERE UserID = ?";
	var changedStatus = (req.params.isVerified == 1) ? '0' : '1';
	connection.query(query, [changedStatus, req.params.userid], function(err, result) {
		if (err) throw err;

		res.redirect('back');
	})
});

router.get('/delete/:userid', isVerified, isAdmin, function(req, res) {
	var query = "DELETE FROM Users WHERE UserID = ?";
	connection.query(query, [req.params.userid], function(err, result) {
		if (err) throw err;

		res.redirect('back');

	});
});

//get student account page
router.get('/:userid', function(req, res) {
	renderScreen(req, res, 'users/user', {
		title: 'User Account'
	});
});


module.exports = router;
