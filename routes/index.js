var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		var user = req.session.passport.user;
	} else {
		var user = null
	}
	console.log(user)
	res.render('index', {
		title: 'Home',
		url: req.originalUrl,
		user: user
	});
});

router.get('/initiate', function(req, res) {
	var connection = req.app.get('connection');
	connection.query('CREATE TABLE Students(' +
		'Student_id int(11) NOT NULL AUTO_INCREMENT,' +
		'Student_number varchar(9),' +
		'First_name varchar(100),' +
		'Last_name varchar(100),' +
		'Major varchar(100),' +
		'PRIMARY KEY(Student_id)' +
		')', function(err, result) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Table Students created.")
		}
	})
});

router.get('/test', function(req, res) {
  res.redirect('verifications/interview')
});

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
}

router.get('/try', isAuthenticated, function(req, res, next) {
	res.render('index', {title: "login"});
});

module.exports = router;
