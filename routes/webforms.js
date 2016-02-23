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

router.get('/interviews/:Semester_id', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/interviews/create', {
			title: "Interviews",
			result: results[0]
		});

	})

});

module.exports = router;