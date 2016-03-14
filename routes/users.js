var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A Router-level middleware check user's authentication before using it
router.use(function (req, res, next) {
  isAuthenticated(req, res, next);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//get student account page
router.get('/:userid', function(req, res) {
	res.render('users/user', {
		title: 'User Account',
		user:req.user[0]
	});
})



module.exports = router;
