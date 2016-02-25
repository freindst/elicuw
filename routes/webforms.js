var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id ORDER BY Students.Student_number";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('webforms/index', {
			title: 'Choose a student record',
			rows: results
		});
	});
});

router.get('/lists/:Semester_id', function(req, res) {
	var Semester_id = req.params.Semester_id;
	res.render('webforms/list', {
		title: 'Webform List',
		Semester_id: Semester_id
	});
});

//define interview class
/*
Interview_id int NOT NULL AUTO_INCREMENT,
Pronunciation int,
Fluency int,
Comprehension int,
Repetition int,
Comments varchar(400),
Recommendation int,
IsVerified bool,
Semester_id int,
PRIMARY KEY (Interview_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/interviews/:Semester_id', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/interviews/create', {
			title: "Interviews",
			result: results[0]
		});
	});
});

router.post('/interviews/:Semesters_id', function(req, res) {
	var query = "INSERT INTO Interviews SET ?";
	var semester = {
		Pronunciation: req.body.Pronunciation,
		Fluency: req.body.Fluency,
		Comprehension: req.body.Comprehension,
		Repetition: req.body.Repetition,
		Comments: req.body.Comments,
		Recommendation: req.body.Recommendation,
		IsVerified: false,
		Semester_id: req.params.Semesters_id
	};
	connection.query(query, semester, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});



module.exports = router;