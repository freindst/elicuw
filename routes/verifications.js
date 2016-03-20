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
				title: 'Unverified ' + TableName.substring(0, TableName.length -1) + ' List',
				rows: results,
				result: result[0],
				all: all,
				url: "/verifications",
				webformType: webformType
			});
		});
	});
});

router.get('/:webformType/:ID', function(req, res) {
	var webformType = req.params.webformType;
	var ID = req.params.ID;
	var TableName = webformType.substring(0,1).toUpperCase() + webformType.slice(1);
	var IndexName = webformType.substring(0, webformType.length - 1) + '_id';
	var title = '';
	switch (webformType) {
		case 'readings':
			title = 'Reading & Vocabulary';
			break;
		case 'writings':
			title = 'Writing & Grammar';
			break;
		case  'speaksings':
			title = 'Speaking & Listening';
			break;
		case 'toefl_preps':
			title = 'TOEFL Preparation';
			break;
		case 'extensive_listenings':
			title = 'Extensive Listening';
			break;
	}
	if (webformType == 'interviews') {
		var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Interviews ON Semesters.Semester_id = Interviews.Semester_id WHERE Interviews.Interview_id = ?";

		connection.query(query, [ID], function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'verifications/interviews', {
				title: "Verify Interview Record",
				result: results[0],
				url: "/verifications"
			});
		});
	}
	else if ( webformType == 'timed_writings') {
		var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Students.Major, Students.Degree, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, Timed_writings.Timed_writing_id AS ID, Timed_writings.Score, Timed_writings.Person_in_charge, Timed_writings.IsVerified FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Timed_writings ON Semesters.Semester_id = Timed_writings.Semester_id WHERE Timed_writings.Timed_writing_id = ?";

		connection.query(query, [req.params.ID], function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'verifications/timed_writings', {
				title: "Timed Writing Exam",
				result: results[0],
				url: "/webforms",
				webformType: 'timed_writings'
			});
		});
	}
	else if ( webformType == 'toefls' ) {
		var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Students.Major, Students.Degree, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, Toefls.Toefl_id AS ID, Toefls.Listening, Toefls.Reading, Toefls.Grammar, Toefls.IsVerified, Toefls.Person_in_charge FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Toefls ON Semesters.Semester_id = Toefls.Semester_id WHERE Toefls.Toefl_id = ?";

		connection.query(query, [ID], function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'verifications/toefls', {
				title: "TOEFL",
				result: results[0],
				url: "/webforms",
				webformType: 'toefls'
			});
		});
	}
	else if ( webformType == 'recommendations') {
		next();
	}
	else {
		var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, ?? AS ID, ??, ??, ?? FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN ?? ON Semesters.Semester_id = ?? WHERE ?? = ?";

		var option = [
		TableName + '.' + IndexName,
		TableName + '.Score',
		TableName + '.IsVerified',
		TableName + '.Person_in_charge',
		TableName,
		TableName + '.Semester_id',
		TableName + '.' + IndexName,
		ID ]

		connection.query(query, option, function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'verifications/grades', {
				title: 'Verify ' + title + ' Record',
				result: results[0],
				url: "/verifications",
				webformType: webformType
			});
		});		
	}
});

router.post('/:webformType/:ID', function(req, res, next) {
	var webformType = req.params.webformType;
	var ID = req.params.ID;
	var TableName = webformType.substring(0,1).toUpperCase() + webformType.slice(1);
	var IndexName = webformType.substring(0,1).toUpperCase() + webformType.substring(1, webformType.length - 1) + '_id';
	if (webformType == 'interviews' || webformType ==  'timed_writings' || webformType == 'toefls' || webformType == 'recommendations') {
		next();
	} 
	else {
		var query = "UPDATE ?? SET ? WHERE ?? = ?";
		var obj = {
			Score: req.body.Score,
			Person_in_charge: req.body.Person_in_charge,
			IsVerified: 1
		};
		var option = [TableName, obj, IndexName, ID];

		Count_unverified_change(TableName, "-");

		connection.query(query, option, function(err, result) {
			if (err) throw err;
			//update final grade
			connection.query('SELECT Semester_id, Score FROM ?? WHERE ?? = ?', [TableName, IndexName, ID], function(err, result) {
				if (err) throw err;
				var Semester_id = result[0].Semester_id;
				var Score = result[0].Score;

				connection.query('SELECT * FROM Final_Grade WHERE Semester_id = ?', [Semester_id], function(err, results) {
					if (err) throw err;

					var grades = {
						'Readings': null,
						'Speaking': null,
						'Writings': null,
						'Toefl_preps': null,
						'Extensive_Listenings': null
					};

					if (results.length != 0) {
						grades = results[0]
					}

					var scores = Convert_Grades(TableName, Score, grades);

					scores[TableName] = Score;
					scores.Semester_id = Semester_id;

					connection.query('INSERT INTO Final_Grade SET ? ON DUPLICATE KEY UPDATE ?? = ?, Raw_grade = ? , Final_grade = ?', [scores, TableName, Score, scores.Raw_grade, scores.Final_grade], function(err, result) {
						if (err) throw err;
						
					});

					connection.query('SELECT * FROM Exit_reports WHERE Semester_id = ?', [Semester_id], function(err, result3) {
						if (result3.length == 0) {
							var option = [
							{
								Semester_id: Semester_id,
								Grades: scores.Final_grade,
								Result: scores.Final_grade
							},
							scores.Final_grade,
							scores.Final_grade
							];
						} else {
							var Result = result3[0].Teacher_recommendation + result3[0].Timed_writing + result3[0].Interview + result3[0].Toefl + scores.Final_grade;
							var option = [
							{
								Semester_id: Semester_id,
								Grades: scores.Final_grade,
								Result: Result
							},
							scores.Final_grade,
							Result
							];
						}
						
						connection.query('INSERT INTO Exit_reports SET ? ON DUPLICATE KEY UPDATE Grades = ? , Result = ?', option, function(err, result) {
							if (err) throw err;
						});
					})
				});
			});

			res.redirect('/verifications/' + webformType);
		});
	}
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

			//change unverified list
			Count_unverified_change('Interviews', '-');

			Update_Result_Interview(Semester_id);

			res.redirect('/verifications/interviews/');
		});		
	});
})

router.post('/timed_writings/:ID', function(req, res) {
	var ID = req.params.ID;
	var item = {
		Person_in_charge: req.body.Person_in_charge,
		Score: req.body.Score,
		IsVerified: 1
	};

	connection.query('SELECT Semester_id FROM Timed_writings WHERE Timed_writing_id = ?', [ID], function(err, result) {
		var Semester_id = result[0].Semester_id;

		var convertedScore = Convert_Score_TWE(req.body.Score);

		connection.query("SELECT * FROM Exit_reports WHERE Semester_id = ?", [Semester_id], function(err, result2) {
			if (result2.length == 0) {
				connection.query("INSERT INTO Exit_reports SET ?", [{Semester_id: Semester_id, Timed_writings: convertedScore, Result: convertedScore}], function(err, result) {
					if (err) throw err;
				})
			}
			else {
				var Result = result2[0].Teacher_recommendation + result2[0].Interview + result2[0].Grades + result2[0].Toefl + convertedScore;
				connection.query("UPDATE Exit_reports SET ? WHERE Semester_id = ?", [{Timed_writing: convertedScore, Result: Result}, Semester_id], function(err, result) {
					if (err) throw err;
				})
			}
		});
	});

	connection.query("UPDATE Timed_writings SET ? WHERE Timed_writing_id = ?", [item, ID], function(err, result) {
		if (err) throw err;

		Count_unverified_change('Timed_writings', '-');

		res.redirect('/verifications/timed_writings');
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

			//change unverified list
			Count_unverified_change('Interviews', '-');

			Update_Result_Interview(Semester_id);

			res.redirect('/verifications/interviews/');
		});		
	});
})

router.post('/toefls/:ID', function(req, res) {
	var ID = req.params.ID;
	var item = {
		Person_in_charge: req.body.Person_in_charge,
		Listening: req.body.Listening,
		Reading: req.body.Reading,
		Grammar: req.body.Grammar,
		IsVerified: 1
	};

	connection.query('SELECT Semester_id FROM Toefls WHERE Toefl_id = ?', [ID], function(err, result) {
		var Semester_id = result[0].Semester_id;

		connection.query("SELECT * FROM Exit_reports INNER JOIN Semesters ON Exit_reports.Semester_id = Semesters.Semester_id INNER JOIN Students ON Semesters.Student_id = Students.Student_id WHERE Exit_reports.Semester_id = ?", [Semester_id], function(err, result2) {
			var Degree = result2.Degree;
			var convertedScore = Convert_Score_Toefl(Degree, item);
			if (result2.length == 0) {
				connection.query("INSERT INTO Exit_reports SET ?", [{Semester_id: Semester_id, Toefl: convertedScore, Result: convertedScore}], function(err, result) {
					if (err) throw err;
				})
			}
			else {
				var Result = result2[0].Teacher_recommendation + result2[0].Interview + result2[0].Grades + result2[0].Timed_writing + convertedScore;
				connection.query("UPDATE Exit_reports SET ? WHERE Semester_id = ?", [{Toefl: convertedScore, Result: Result}, Semester_id], function(err, result) {
					if (err) throw err;
				})
			}
		});
	});

	connection.query("UPDATE Toefls SET ? WHERE Toefl_id = ?", [item, ID], function(err, result) {
		if (err) throw err;

		Count_unverified_change('Toefls', '-');

		res.redirect('/verifications/toefls');
	});

});

module.exports = router;