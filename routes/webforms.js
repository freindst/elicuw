var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools')();

//A router level middleware check user authentication first
router.use(function (req, res, next) {
  isAuthenticated(req, res, next);
}, function (req, res, next) {
	isVerified(req, res, next);
});

//choose a form to input
router.get('/', function(req, res, next) {
	renderWebformsIndex(req, res, 'lists');
});

//list all semester records
router.get('/lists/:Semester_id', function(req, res, next) {
	var Semester_id = req.params.Semester_id;
	renderScreen(req, res, 'webforms/list', {
		title: 'Webform List',
		Semester_id: Semester_id,
		url: "/webforms"
	});
});

//another portal to go to webform input, by choosing webform type first
router.get('/:webformType', function(req, res, next) {
	var webformType = req.params.webformType;
	if (webformType == 'interviews') {
		renderWebformsIndex(req, res, webformType);
	} else {
		renderWebformsIndex(req, res, webformType);
	}	
})

//Final_interview: contains final score of the interview and all interview_id
/*
CREATE TABLE Final_interview (
Final_interview_id int NOT NULL AUTO_INCREMENT,
Semester_id int UNIQUE,
Count int DEFAULT 0,
Score varchar(5),
PRIMARY KEY (Final_interview_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/

router.get('/interviews/', function(req, res) {
	var query = 'SELECT Semesters.Semester_id, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, Students.Student_number, Students.First_name, Students.Last_name, Students.Major, Final_interview.Count, Final_interview.Score FROM Semesters INNER JOIN Students ON Semesters.Student_id = Students.Student_id LEFT JOIN Final_interview ON Semesters.Semester_id = Final_interview.Semester_id';

	connection.query(query, function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/interviews/index', {
			title: 'Choose a student record',
			rows: results,
			url: '/webforms'
		});
	});
});

//intervbiew: Each item is related to a semester item by Semester_id
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
Person_in_charge varchar(255),
PRIMARY KEY (Interview_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/interviews/:Semester_id', function(req, res) {
	var Semester_id = req.params.Semester_id;
	var userQuery = 'SELECT Semesters.Semester_id, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, Students.Student_number, Students.First_name, Students.Last_name, Students.Major FROM Semesters INNER JOIN Students ON Semesters.Student_id = Students.Student_id WHERE Semesters.Semester_id = ?';
	var interviewQuery = 'SELECT * FROM Interviews WHERE Semester_id = ?';

	connection.query(userQuery, [Semester_id], function (err, student) {
		if (err) throw err;

		connection.query(interviewQuery, [Semester_id], function (err, interviews) {
			if (err) throw err;

			renderScreen(req, res, 'webforms/interviews/list', {
				title: "Interview Record List",
				student: student[0],
				rows: interviews,
				url: '/webforms'
			});
		});
	});
});

router.get('/interviews/create/:Semester_id', function(req, res) {
	var Semester_id = req.params.Semester_id;
	var queryNumber = 'SELECT COUNT(*) AS Number FROM Interviews WHERE Semester_id = ?';
	connection.query(queryNumber, [Semester_id], function(err, count) {
		if (err) throw err;

		if (count[0].Number >= 2) {
			req.session.error_message = 'Cannot create more than two Interview records.';
			res.redirect('back');
		}
		else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Students.Major, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?";
			connection.query(query, [Semester_id], function(err, result) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/interviews/create', {
					title: "Create Interview Record",
					result: result[0],
					url: "/webforms"
				});
			});
		}
	});
});

//save records to database
router.post('/interviews/create/:Semester_id', function(req, res) {
	var query = "INSERT INTO Interviews SET ?";
	var semester = {
		Person_in_charge: req.body.Person_in_charge,
		Pronunciation: req.body.Pronunciation,
		Fluency: req.body.Fluency,
		Comprehension: req.body.Comprehension,
		Repetition: req.body.Repetition,
		Comments: req.body.Comments,
		Recommendation: req.body.Recommendation,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, semester, function(err, result) {
		if (err) throw err;

		res.redirect('/webforms/interviews/' + req.params.Semester_id);
	});
});

//if there is an existed record of interview, take it back and open an edit page
router.get('/interviews/edit/:Interview_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Interviews ON Semesters.Semester_id = Interviews.Semester_id WHERE Interviews.Interview_id = ?";

	connection.query(query, [req.params.Interview_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/interviews/edit', {
			title: "Edit Interview Record",
			result: results[0],
			url: "/webforms"
		});
	});
});

//update the existed record
router.post('/interviews/edit/:Interview_id', function(req, res) {
	var Interview_id = req.params.Interview_id;
	var interview = {
		Person_in_charge: req.body.Person_in_charge,
		Pronunciation: req.body.Pronunciation,
		Fluency: req.body.Fluency,
		Comprehension: req.body.Comprehension,
		Repetition: req.body.Repetition,
		Comments: req.body.Comments,
		Recommendation: req.body.Recommendation
	};

	connection.query("SELECT * FROM Interviews WHERE Interview_id = ?", [Interview_id], function(err, result) {
		var Semester_id = result[0].Semester_id;
		connection.query("UPDATE Interviews SET ? WHERE Interview_id = ?", [interview, Interview_id], function(err, result2) {
			if (err) throw err;

			res.redirect('/webforms/interviews/' + Semester_id);
		});		
	});
});

//delete an exited record based on Semester_id
router.get('/interviews/delete/:Interview_id', function(req, res) {
	connection.query("DELETE FROM Interviews WHERE Interview_id = ?", [req.params.Interview_id], function(err, result) {
		if (err) throw err;

		res.redirect('back')
	});
});

//grade - reading
//define Readings class
/*
Reading_id int NOT NULL AUTO_INCREMENT,
Reading_score varchar(5),
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Reading_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/readings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Readings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			var error_message = 'There is an existed record belong to the same student in the semester. Jumped to edit page instead of create page.';
			req.session.error_message = error_message;
			res.redirect('/webforms/readings/edit/' + req.params.Semester_id);
		}
		else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/readings/create', {
					title: "Reading & Vocabulary",
					result: results[0],
					url: "/webforms"
				});
			});
		}
	});

});

router.post('/readings/:Semester_id', function(req, res) {
	var query = "INSERT INTO Readings SET ?";
	var reading = {
		Reading_score: req.body.Reading_score,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, reading, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});

router.get('/readings/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Readings ON Semesters.Semester_id = Readings.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/readings/edit', {
			title: "Verify Reading & Vocabulary",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/readings/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Readings SET ? WHERE Semester_id = ?"
	var reading = {
		Reading_score: req.body.Reading_score,
		IsVerified: true
	};

	connection.query(query, [reading, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/reading')
	});
});

router.get('/readings/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Readings WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/reading')
	});
});

//grade-speaking
//define speaking class
/*
Speaking_id int NOT NULL AUTO_INCREMENT,
Speaking_score varchar(5),
IsVerified bool,
Semester_id int,
PRIMARY KEY (Speaking_id),
Person_in_charge varchar(255),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/speakings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Speakings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			var error_message = 'There is an existed record belong to the same student in the semester. Jumped to edit page instead of create page.';
			req.session.error_message = error_message;
			res.redirect('/webforms/speakings/edit/' + req.params.Semester_id);
		} else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/speakings/create', {
					title: "Speaking & Listening",
					result: results[0],
					url: "/webforms"
				});
			});			
		}
	});		
});

router.post('/speakings/:Semester_id', function(req, res) {
	var query = "INSERT INTO Speakings SET ?";
	var speaking = {
		Speaking_score: req.body.Speaking_score,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, speaking, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});

router.get('/speakings/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Speakings ON Semesters.Semester_id = Speakings.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/speakings/edit', {
			title: "Verify Speakings & Listening",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/speakings/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Speakings SET ? WHERE Semester_id = ?"
	var speaking = {
		Speaking_score: req.body.Speaking_score,
		IsVerified: true
	};

	connection.query(query, [speaking, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/speaking')
	});
});

router.get('/speakings/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Speakings WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/speaking')
	});
});


//grade - writing
//define writing class
/*
Writing_id int NOT NULL AUTO_INCREMENT,
Writing_score varchar(5),
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Writing_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/writings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Writings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			var error_message = 'There is an existed record belong to the same student in the semester. Jumped to edit page instead of create page.';
			req.session.error_message = error_message;
			res.redirect('/webforms/writings/edit/' + req.params.Semester_id);
		}
		else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/writings/create', {
					title: "Writing & Grammar",
					result: results[0],
					url: "/webforms"
				});
			});			
		}
	});

});

router.post('/writings/:Semester_id', function(req, res) {
	var query = "INSERT INTO Writings SET ?";
	var writing = {
		Writing_score: req.body.Writing_score,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, writing, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});

router.get('/writings/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Writings ON Semesters.Semester_id = Writings.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/writings/edit', {
			title: "Verify Writing & Grammar",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/writings/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Writings SET ? WHERE Semester_id = ?"
	var writing = {
		Writing_score: req.body.Writing_score,
		IsVerified: true
	};

	connection.query(query, [writing, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/writing')
	});
});

router.get('/writings/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Writings WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/writing')
	});
});

//grade - toofl prep
//define Toefl_preps class
/*
CREATE TABLE Toefl_prep(
Toefl_prep_id int NOT NULL UNIQUE AUTO_INCREMENT,
Toefl_prep_score varchar(5),
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Toefl_prep_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/

router.get('/toefl_preps/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM ?? WHERE Semester_id = ?', ['Toefl_preps', req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			var error_message = 'There is an existed record belong to the same student in the semester. Jumped to edit page instead of create page.';
			req.session.error_message = error_message;
			res.redirect('/webforms/' + 'toefl_preps' + '/edit/' + req.params.Semester_id);
		}
		else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/grades/create', {
					title: "Toefl Preparation",
					result: results[0],
					url: "/webforms",
					gradingWebformType: 'toefl_preps',
					scoreType: 'Toefl_prep_score'
				});
			});			
		}
	});

});

router.post('/toefl_preps/:Semester_id', function(req, res) {
	var query = "INSERT INTO Toefl_preps SET ?";
	var toefl_prep = {
		Toefl_prep_score: req.body.Toefl_prep_score,
		IsVerified: false,
		Semester_id: req.params.Semester_id,
		Person_in_charge: req.body.Person_in_charge
	};

	connection.query(query, toefl_prep, function(err, result) {
		if (err) throw err;
		req.session.okay_message = 'A record has been saved successfully.'
		res.redirect('/');
	});
});

router.get('/toefl_preps/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Toefl_preps ON Semesters.Semester_id = Toefl_preps.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/grades/edit', {
			title: "Toefl Preparation",
			result: results[0],
			url: "/webforms",
			gradingWebformType: 'toefl_preps',
			scoreType: 'Toefl_prep_score',
			score: results[0].Toefl_prep_score
		});
	});
});

router.post('/toefl_preps/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Toefl_preps SET ? WHERE Semester_id = ?"
	var toefl_prep = {
		Toefl_prep_score: req.body.Toefl_prep_score,
		IsVerified: true,
		Semester_id: req.params.Semester_id,
		Person_in_charge: req.body.Person_in_charge
	};

	connection.query(query, [toefl_prep, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/toefl_prep')
	});
});

router.get('/toefl_preps/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Toefl_preps WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/toefl_prep')
	});
});

//grade extensive listening
//define Extensive_listenings class
/*
CREATE TABLE Extensive_listenings(
Extensive_listening_id int NOT NULL UNIQUE AUTO_INCREMENT,
Extensive_listening_score varchar(5),
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Extensive_listening_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/

router.get('/extensive_listenings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM ?? WHERE Semester_id = ?', ['Extensive_listenings', req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			var error_message = 'There is an existed record which belongs to the same student in the semester. Jumped to edit page instead of create page.';
			req.session.error_message = error_message;
			res.redirect('/webforms/' + 'extensive_listenings' + '/edit/' + req.params.Semester_id);
		}
		else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/grades/create', {
					title: "Extensive Listening",
					result: results[0],
					url: "/webforms",
					gradingWebformType: 'extensive_listenings',
					scoreType: 'Extensive_listening_score'
				});
			});			
		}
	});

});

router.post('/extensive_listenings/:Semester_id', function(req, res) {
	var query = "INSERT INTO Extensive_listenings SET ?";
	var extensive_listening = {
		Extensive_listening_score: req.body.Extensive_listening_score,
		IsVerified: false,
		Semester_id: req.params.Semester_id,
		Person_in_charge: req.body.Person_in_charge
	};

	connection.query(query, extensive_listening, function(err, result) {
		if (err) throw err;
		req.session.okay_message = 'A record has been saved successfully.'
		res.redirect('/');
	});
});

router.get('/extensive_listenings/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Extensive_listenings ON Semesters.Semester_id = Extensive_listenings.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/grades/edit', {
			title: "Extensive Listening",
			result: results[0],
			url: "/webforms",
			gradingWebformType: 'extensive_listenings',
			scoreType: 'Extensive_listening_score',
			score: results[0].Extensive_listening_score
		});
	});
});

router.post('/extensive_listenings/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Extensive_listenings SET ? WHERE Semester_id = ?"
	var extensive_listening = {
		Extensive_listening_score: req.body.Extensive_listening_score,
		IsVerified: true,
		Semester_id: req.params.Semester_id,
		Person_in_charge: req.body.Person_in_charge
	};

	connection.query(query, [extensive_listening, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/extensive_listening')
	});
});

router.get('/extensive_listenings/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Extensive_listenings WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/extensive_listening')
	});
});

// toefl
//define toefl class
/*
Toefl_id int NOT NULL AUTO_INCREMENT,
Listening int,
Reading int,
Grammar int,
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Toefl_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/toefls/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Toefls WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			var error_message = 'There is an existed record belong to the same student in the semester. Jumped to edit page instead of create page.';
			req.session.error_message = error_message;
			res.redirect('/webforms/toefls/edit/' + req.params.Semester_id);
		}
		else {
			var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/toefls/create', {
					title: "TOEFL",
					result: results[0],
					url: "/webforms"
				});
			});			
		}
	});

});

router.post('/toefls/:Semester_id', function(req, res) {
	var query = "INSERT INTO Toefls SET ?";
	var toefl = {
		Grammar: req.body.Grammar,
		Listening: req.body.Listening,
		Reading: req.body.Reading,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, toefl, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});

router.get('/toefls/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Toefls ON Semesters.Semester_id = Toefls.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/toefls/edit', {
			title: "Verify TOEFL Score",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/toefls/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Toefls SET ? WHERE Semester_id = ?"
	var toefl = {
		Grammar: req.body.Grammar,
		Listening: req.body.Listening,
		Reading: req.body.Reading,
		IsVerified: true
	};

	connection.query(query, [toefl, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/toefl')
	});
});

router.get('/toefls/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Toefls WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/toefl')
	});
});

//recommendation
//define recommendation class
/*
Recommendation_id int NOT NULL AUTO_INCREMENT,
Attendence varchar(10),
Completion varchar(10),
Participation varchar(20),
Attitude varchar(20),
Recommendation_level int,
Comments varchar(255),
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Recommendation_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/recommendations/:Semester_id', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/recommendations/create', {
			title: "Teacher Recommendation",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/recommendations/:Semester_id', function(req, res) {
	var query = "INSERT INTO Recommendations SET ?";
	var recommendation = {
		Person_in_charge: req.body.Person_in_charge,
		Attendence: req.body.Attendence,
		Completion: req.body.Completion,
		Participation: req.body.Participation,
		Attitude: req.body.Attitude,
		Recommendation_level: req.body.Recommendation_level,
		Comments: req.body.Comments,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, recommendation, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});

router.get('/recommendations/edit/:Recommendation_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Recommendations ON Semesters.Semester_id = Recommendations.Semester_id WHERE Recommendations.Recommendation_id = ?";

	connection.query(query, [req.params.Recommendation_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/recommendations/edit', {
			title: "Verify Teacher Recommendation",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/recommendations/edit/:Recommendation_id', function(req, res) {
	var query = "UPDATE Recommendations SET ? WHERE Recommendation_id = ?"
	var recommendation = {
		Person_in_charge: req.body.Person_in_charge,
		Attendence: req.body.Attendence,
		Completion: req.body.Completion,
		Participation: req.body.Participation,
		Attitude: req.body.Attitude,
		Recommendation_level: req.body.Recommendation_level,
		Comments: req.body.Comments,
		IsVerified: true
	};

	connection.query(query, [recommendation, req.params.Recommendation_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/recommendation')
	});
});

router.get('/recommendations/delete/:Recommendation_id', function(req, res) {
	connection.query("DELETE FROM Recommendations WHERE Recommendation_id = ?", [req.params.Recommendation_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/recommendation')
	});
});


//timed writing
//define timed_writing class
/*
Timed_writing_id int NOT NULL AUTO_INCREMENT,
Score varchar(5),
IsVerified bool,
Semester_id int,
Person_in_charge varchar(255),
PRIMARY KEY (Timed_writing_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/timed_writings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Timed_writings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('/webforms/timed_writings/edit/' + req.params.Semester_id);
		}
		else {
			var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
			connection.query(query, [req.params.Semester_id], function(err, results) {
				if (err) throw err;

				renderScreen(req, res, 'webforms/timed_writings/create', {
					title: "Timed Writing",
					result: results[0],
					url: "/webforms"
				});
			});			
		}
	});

});

router.post('/timed_writings/:Semester_id', function(req, res) {
	var query = "INSERT INTO Timed_writings SET ?";
	var timed_writing = {
		Score: req.body.Score,
		IsVerified: false,
		Semester_id: req.params.Semester_id
	};

	connection.query(query, timed_writing, function(err, result) {
		if (err) throw err;

		res.redirect('/');
	});
});

router.get('/timed_writings/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Timed_writings ON Semesters.Semester_id = Timed_writings.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		renderScreen(req, res, 'webforms/timed_writings/edit', {
			title: "Verify Timed Writing Score",
			result: results[0],
			url: "/webforms"
		});
	});
});

router.post('/timed_writings/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Timed_writings SET ? WHERE Semester_id = ?"
	var timed_writing = {
		Score: req.body.Score,
		IsVerified: true
	};

	connection.query(query, [timed_writing, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/timed_writing')
	});
});

router.get('/timed_writings/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Timed_writings WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/timed_writing')
	});
});

//used for router.get('/:webformType', function()}
function renderWebformsIndex(req, res, webformType) {
	if (webformType == 'interviews') {
		var query = 'SELECT Semesters.Semester_id, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section, Students.Student_number, Students.First_name, Students.Last_name, Students.Major, Final_interview.Count, Final_interview.Score FROM Semesters INNER JOIN Students ON Semesters.Student_id = Students.Student_id LEFT JOIN Final_interview ON Semesters.Semester_id = Final_interview.Semester_id';

		connection.query(query, function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'webforms/interviews/index', {
				title: 'Choose a student record',
				rows: results,
				url: '/webforms'
			});
		});
	} else {
		var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Students.Major, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id ORDER BY Students.Student_number";
		connection.query(query, function(err, results) {
			if (err) throw err;

			renderScreen(req, res, 'webforms/index', {
				title: "Choose a student record",
				rows: results,
				url: "/webforms",
				webformType: webformType
			});
		});		
	}
};

module.exports = router;