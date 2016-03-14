var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A Router-level middleware check user's authentication before using it
router.use(function (req, res, next) {
  isAuthenticated(req, res, next);
});


router.get('/', function(req, res) {
	res.render('verifications/index', {
		title: 'Verify',
		user: req.user[0],
		url: "/verifications"
	});
});

router.get('/interview', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Interviews ON Semesters.Semester_id = Interviews.Semester_id WHERE Interviews.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/interview', {
			title: 'Unverified Interview List',
			rows: results,
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/reading', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Readings ON Semesters.Semester_id = Readings.Semester_id WHERE Readings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/genericVerification', {
			title: 'Unverified Reading List',
			rows: results,
			webformType: 'readings',			
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/speaking', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Speakings ON Semesters.Semester_id = Speakings.Semester_id WHERE Speakings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/genericVerification', {
			title: 'Unverified Speaking List',
			rows: results,
			webformType: 'speakings',			
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/writing', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Writings ON Semesters.Semester_id = Writings.Semester_id WHERE Writings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/genericVerification', {
			title: 'Unverified Writings List',
			rows: results,
			webformType: 'writings',			
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/toefl_prep', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Toefl_preps ON Semesters.Semester_id = Toefl_preps.Semester_id WHERE Toefl_preps.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/genericVerification', {
			title: 'Unverified Toefl Preparation List',
			rows: results,
			webformType: 'toefl_preps',			
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/extensive_listening', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Extensive_listenings ON Semesters.Semester_id = Extensive_listenings.Semester_id WHERE Extensive_listenings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/genericVerification', {
			title: 'Unverified Extensive Listening List',
			rows: results,
			webformType: 'extensive_listenings',			
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/toefl', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Toefls ON Semesters.Semester_id = Toefls.Semester_id WHERE Toefls.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/toelf', {
			title: 'Unverified TOEFL Score List',
			rows: results,
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/recommendation', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Recommendations ON Semesters.Semester_id = Recommendations.Semester_id WHERE Recommendations.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/recommendation', {
			title: 'Unverified Recommendation List',
			rows: results,
			user: req.user[0],
			url: "/verifications"
		});
	});
});

router.get('/timed_writing', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Timed_writings ON Semesters.Semester_id = Timed_writings.Semester_id WHERE Timed_writings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/Timed_writing', {
			title: 'Unverified Timed Writing List',
			rows: results,
			user: req.user[0],
			url: "/verifications"
		});
	});
});

module.exports = router;