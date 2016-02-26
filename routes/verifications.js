var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('verifications/index', {
		title: 'Verify'
	});
});

router.get('/interview', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Interviews ON Semesters.Semester_id = Interviews.Semester_id WHERE Interviews.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/interview', {
			title: 'Unverified Interview List',
			rows: results
		});
	});
});

router.get('/reading', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Readings ON Semesters.Semester_id = Readings.Semester_id WHERE Readings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/reading', {
			title: 'Unverified Reading List',
			rows: results
		});
	});
});

router.get('/speaking', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Speakings ON Semesters.Semester_id = Speakings.Semester_id WHERE Speakings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/speaking', {
			title: 'Unverified Speaking List',
			rows: results
		});
	});
});

router.get('/writing', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Writings ON Semesters.Semester_id = Writings.Semester_id WHERE Writings.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/writing', {
			title: 'Unverified Writing List',
			rows: results
		});
	});
});

router.get('/recommendation', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Recommendations ON Semesters.Semester_id = Recommendations.Semester_id WHERE Recommendations.IsVerified = FALSE";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('verifications/recommendation', {
			title: 'Unverified Recommendation List',
			rows: results
		});
	});
});

module.exports = router;