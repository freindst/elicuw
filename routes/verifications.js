var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A Router-level middleware check user's authentication before using it
router.use(function (req, res, next) {
  isAuthenticated(req, res, next);
}, function(req, res, next) {
	isVerified(req, res, next);
}, function(req, res, next) {
	isAdmin(req, res, next);
});

router.get('/', function(req, res) {
	connection.query("SELECT * FROM Count_unverified WHERE ID = 1", function(err, result) {
		if (err) throw err;

		var all = -1;
		for (var key in result[0]) {
			all += result[0][key];
		}

		renderScreen(req, res, 'verifications/index', {
			title: 'Verify',
			url: "/verifications",
			result: result[0],
			all: all
		});	
	});

});

router.get('/:webformType', function(req, res) {
	var webformType = req.params.webformType;
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, ?? AS ID FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN ?? ON Semesters.Semester_id = ?? WHERE ?? = FALSE ORDER BY Semesters.Year DESC, Semesters.Season DESC";
	connection.query("SELECT * FROM Count_unverified WHERE ID = 1", function(err, result) {
		if (err) throw err;

		var all = -1;
		for (var key in result[0]) {
			all += result[0][key];
		}

		TableName = webformType.substring(0, 1).toUpperCase() + webformType.substring(1);
		IndexName = webformType.substring(0, webformType.length - 1) + '_id';
		queryOption = [
		TableName + '.' + IndexName,
		TableName,
		TableName + '.Semester_id',
		TableName + '.IsVerified'
		];

		connection.query(query, queryOption, function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'verifications/genericVerification', {
				title: 'Unverified ' + TableName + ' List',
				rows: results,
				result: result[0],
				all: all,
				url: "/verifications",
				webformType: webformType
			});
		});
	});
});

router.get('/interviews/:Interview_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Interviews ON Semesters.Semester_id = Interviews.Semester_id WHERE Interviews.Interview_id = ?";

	connection.query(query, [req.params.Interview_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'verifications/interviews', {
			title: "Edit Interview Record",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/interviews/:Interview_id', function(req, res) {
	var Interview_id = req.params.Interview_id;
	var interview = {
		Person_in_charge: req.body.Person_in_charge,
		Pronunciation: req.body.Pronunciation,
		Fluency: req.body.Fluency,
		Comprehension: req.body.Comprehension,
		Repetition: req.body.Repetition,
		Comments: req.body.Comments,
		Recommendation: req.body.Recommendation,
		IsVerified: true
	};

	connection.query("SELECT * FROM Interviews WHERE Interview_id = ?", [Interview_id], function(err, result) {
		var Semester_id = result[0].Semester_id;
		connection.query("UPDATE Interviews SET ? WHERE Interview_id = ?", [interview, Interview_id], function(err, result2) {
			if (err) throw err;

			Count_unverified_change('Interviews', '-');
			res.redirect('/verifications/interviews/');
		});		
	});
})

module.exports = router;