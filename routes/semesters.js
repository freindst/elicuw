var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A router-level middleware check authentication before using any functions
router.use(function (req, res, next) {
  isAuthenticated(req, res, next);
});



//get the list of semester info combined with student profile
router.get('/index',  function(req, res, next) {
	var query = "SELECT Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id ORDER BY Students.Student_number";
	connection.query(query, function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'semesters/index', {
			title: 'Semester List',
			rows: results,
			url: '/students'
		});
	});
});

//get all existed semester record related to a student_id
router.get('/get/:Student_id',  function(req, res, next) {
	connection.query("SELECT * FROM Students WHERE Student_id = ?", [req.params.Student_id], function(err, students) {
		if (err) throw err;

		connection.query("SELECT Semester_id, Year, Season, Term, Level, Section FROM Semesters WHERE Student_id = ? ORDER BY Year", [req.params.Student_id], function(err, rows) {
			if (err) throw err;

			renderScreen(req, res, 'semesters/get', {
				title: 'Student Semester',
				student: students[0],
				rows: rows,
				url: '/students'
			})
		});
	});
});

//create a semester item related to a student_id
router.get('/create/:Student_id', function(req, res, next) {
	connection.query("SELECT * FROM Students WHERE Student_id = ?", [req.params.Student_id], function(err, students) {
		if (err) throw err;

		renderScreen(req, res, 'semesters/create', {
			title: 'Create Student Semester Information',
			student: students[0],
			url: '/students'
		});
	});
});

router.post('/create/:Student_id', function(req, res) {
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

//edit one semester record
router.get('/edit/:Student_id/:Semester_id', function(req, res) {
	connection.query("SELECT * FROM Students WHERE Student_id = ?", [req.params.Student_id], function(err, students) {
		if (err) throw err;

		connection.query("SELECT * FROM Semesters WHERE Semester_id = ?", [req.params.Semester_id], function(err, semesters) {
			if (err) throw err;

			renderScreen(req, res, 'semesters/edit', {
				title: 'Student Semester',
				student: students[0],
				semester: semesters[0],
				url: '/students'
			})
		});
	});
});

router.post('/edit/:Student_id/:Semester_id', function(req, res) {
	var semester = {
		Year: req.body.Year,
		Season: req.body.Season,
		Term: req.body.Term,
		Level: req.body.Level,
		Section: req.body.Section,
		Student_id: req.params.Student_id
	};

	connection.query('UPDATE Semesters SET ? WHERE Semester_id = ?', [semester, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/semesters/get/' + req.params.Student_id);
	})
})

//delete a semester item
router.get('/delete/:Student_id/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Semesters WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/semesters/get/' + req.params.Student_id);
	});
});

module.exports = router;