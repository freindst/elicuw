var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A Router-level middleware check user's authentication before using it
router.use(function (req, res, next) {
  isAuthenticated(req, res, next);
});

router.use(function (req, res, next) {
	isVerified(req, res, next);
});

router.use(function (req, res, next) {
	isAdmin(req, res, next);
});


//exit criteria report
/*
Exit_report_id int NOT NULL AUTO_INCREMENT,
Semester_id int UNIQUE,
Teacher_recommendation int,
Timed_writing int,
Grades int,
Interview int,
Toefl int,
Result int,
PRIMARY KEY (Exit_report_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

//retrieve all records in exit report table
router.get('/', function(req, res) {
	connection.query('SELECT * FROM Exit_reports INNER JOIN Semesters ON Exit_reports.Semester_id = Semesters.Semester_id INNER JOIN Students on Semesters.Student_id=Students.Student_id', function(err, results) {
		renderScreen(req, res, 'reports/exit_report', {
			title: 'Exit Report List',
			url: '/reports',
			rows: results
		});
	});
});

router.get('/grade/:Semester_id', function(req, res) {

});


//get individual report
router.get('/individual/:Semester_id', function(req, res) {
	var query = 'SELECT * FROM Semesters AS se INNER JOIN Students AS s ON se.Student_id = s.Student_id LEFT JOIN Toefls AS t ON t.Semester_id = se.Semester_id LEFT JOIN Exit_reports ON Exit_reports.Semester_id = se.Semester_id WHERE se.Semester_id = ?'
	connection.query(query , [req.params.Semester_id], function(err, result) {
/*		res.render('reports/individual', {
			row: results[0],
			title: 'Individual Report'
		});*/
		renderScreen(req, res,'reports/individual', {
			result: result[0],
			title: 'Individual Report',
			url: '/reports'
		});
	});
});

router.get('/grades/:Semester_id', function(req, res) {

	var query = 'SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id = Students.Student_id LEFT JOIN Final_Grade ON Final_Grade.Semester_id = Semesters.Semester_id WHERE Semesters.Semester_id = ?';
	connection.query(query, [req.params.Semester_id], function(err, result) {
		if (err) throw err;
		if (result.length == 0) {
			res.send("no result");
		} else {

		renderScreen(req, res, 'reports/grades', {
			result: result[0],
			title: 'Grades',
			url: '/reports'
		})			
		}

	});
});

module.exports = router;