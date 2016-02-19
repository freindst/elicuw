var express = require('express');
var router = express.Router();

//define semester class
/*
Semester_id int NOT NULL AUTO_INCREMENT,
Year int,
Season varchar(10),
Term varchar(10),
Level varchar(10),
Section varchar(10),
Student_id int,
PRIMARY KEY (Semester_id),
FOREIGN KEY (Student_id) REFERENCEs Students(Student_id)
*/

router.get('/index', function(req, res) {
	var query = "SELECT Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id ORDER BY Students.Student_number";
	connection.query(query, function(err, results) {
		if (err) throw err;

		res.render('semesters/index', {
			title: 'Semester List',
			rows: results
		});
	});
});

router.get('/get/:Student_id', function(req, res) {
	connection.query("SELECT * FROM Students WHERE Student_id = ?", [req.params.Student_id], function(err, students) {
		if (err) throw err;

		connection.query("SELECT Semester_id, Year, Season, Term, Level, Section FROM Semesters WHERE Student_id = ? ORDER BY Year", [req.params.Student_id], function(err, rows) {
			if (err) throw err;

			console.log(rows[0])

			res.render('semesters/get', {
				title: 'Student Semester',
				student: students[0],
				rows: rows
			})
		});
	});
});

router.get('/create/:Student_id', function(req, res) {
	connection.query("SELECT * FROM Students WHERE Student_id = ?", [req.params.Student_id], function(err, students) {
		if (err) throw err;

		res.render('semesters/create', {
			title: 'Create Student Semester Information',
			student: students[0]
		});
	});
});

router.post('/create/:Student_id', function(req, res) {
	console.log('in it');
	var query = "INSERT INTO Semesters SET ?";
	var semester = {
		Year: req.body.Year,
		Season: req.body.Season,
		Term: req.body.Term,
		Level: req.body.Level,
		Section: req.body.Section,
		Student_id: req.params.Student_id
	};
	connection.query(query, semester, function(err, result) {
		if (err) throw err;

		res.redirect('/semesters/get/' + req.params.Student_id);
	});
});



module.exports = router;