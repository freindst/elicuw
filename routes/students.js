var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var connection = req.app.get('connection');
	connection.query('SELECT * FROM Students', function(err, students) {
		if (err) throw err;

		res.render('Students/index', {
			title: 'Student List',
			students: students
		});
	});
});

//Create a new student profile
router.get('/create', function(req, res) {
	res.render('Students/create', {
		title: 'Create Student Profile'
	});
});

//Receive a student profile
router.post('/create', function(req, res) {
	var student = {
		Student_number: req.body.Student_number,
		First_name: req.body.First_name,
		Last_name: req.body.Last_name,
		Major: req.body.Major
	};

	var connection = req.app.get('connection');
	connection.query('INSERT INTO Students SET ?', student, function(err, result) {
		if (err) throw err;

		res.redirect('/students');
	})
});

//Update a student profile
router.get('/edit/:Student_id', function(req, res) {
	var Student_id = req.params.Student_id;

	var connection = req.app.get('connection');
	connection.query('SELECT * FROM Students WHERE Student_id = "' + Student_id + '"', function(err, student) {
		if (err) throw err;

		res.render('Students/edit', {
			title: 'Edit Student File',
			student: student[0]
		});
	});
});

router.post('/edit/:Student_id', function(req, res) {
	var Student_id = req.params.Student_id;
	var student = {
		Student_number: req.body.Student_number,
		First_name: req.body.First_name,
		Last_name: req.body.Last_name,
		Major: req.body.Major
	};

	var connection = req.app.get('connection');
	connection.query('UPDATE Students SET ? WHERE Student_id = ?', [student, Student_id], function(err, result) {
		if (err) throw err;

		res.redirect('/students');
	});
});

//Delete a student profile
router.get('/delete/:Student_id', function(req, res) {
	var Student_id = req.params.Student_id;

	console.log("student id is " + Student_id);

	var connection = req.app.get('connection');
	connection.query('DELETE FROM Students WHERE Student_id = ?', [Student_id], function(err, result) {
		if(err) throw err;

		res.redirect('/students');
	});
});

module.exports = router;