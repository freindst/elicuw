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
	connection.query('SELECT * FROM Interviews WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('edit/' + req.params.Semester_id);
		}
	});
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/interviews/create', {
			title: "Interviews",
			result: results[0]
		});
	});
});

router.post('/interviews/:Semester_id', function(req, res) {
	var query = "INSERT INTO Interviews SET ?";
	var semester = {
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

		res.redirect('/');
	});
});

router.get('/interviews/edit/:Semester_id', function(req, res) {
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id INNER JOIN Interviews ON Semesters.Semester_id = Interviews.Semester_id WHERE Semesters.Semester_id = ?";

	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/interviews/edit', {
			title: "Verify Interview",
			result: results[0]
		});
	});
});

router.post('/interviews/edit/:Semester_id', function(req, res) {
	var query = "UPDATE Interviews SET ? WHERE Semester_id = ?"
	var interview = {
		Pronunciation: req.body.Pronunciation,
		Fluency: req.body.Fluency,
		Comprehension: req.body.Comprehension,
		Repetition: req.body.Repetition,
		Comments: req.body.Comments,
		Recommendation: req.body.Recommendation,
		IsVerified: true
	};

	connection.query(query, [interview, req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/interview')
	});
});

router.get('/interviews/delete/:Semester_id', function(req, res) {
	connection.query("DELETE FROM Interviews WHERE Semester_id = ?", [req.params.Semester_id], function(err, result) {
		if (err) throw err;

		res.redirect('/verifications/interview')
	});
});

//define reading class
/*
Reading_id int NOT NULL AUTO_INCREMENT,
Reading_score varchar(5),
IsVerified bool,
Semester_id int,
PRIMARY KEY (Reading_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/readings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Readings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('edit/' + req.params.Semester_id);
		}
	});
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/readings/create', {
			title: "Reading & Vocabulary",
			result: results[0]
		});
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

		res.render('webforms/readings/edit', {
			title: "Verify Reading & Vocabulary",
			result: results[0]
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

//define speaking class
/*
Speaking_id int NOT NULL AUTO_INCREMENT,
Speaking_score varchar(5),
IsVerified bool,
Semester_id int,
PRIMARY KEY (Speaking_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/speakings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Speakings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('edit/' + req.params.Semester_id);
		}
	});
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/speakings/create', {
			title: "Speaking & Listening",
			result: results[0]
		});
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

		res.render('webforms/speakings/edit', {
			title: "Verify Speakings & Listening",
			result: results[0]
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

//define writing class
/*
Writing_id int NOT NULL AUTO_INCREMENT,
Writing_score varchar(5),
IsVerified bool,
Semester_id int,
PRIMARY KEY (Writing_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/
router.get('/writings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Writings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('edit/' + req.params.Semester_id);
		}
	});
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/writings/create', {
			title: "Writing & Grammar",
			result: results[0]
		});
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

		res.render('webforms/writings/edit', {
			title: "Verify Writing & Grammar",
			result: results[0]
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

//define toefl class
/*
Toefl_id int NOT NULL AUTO_INCREMENT,
Listening int,
Reading int,
Grammar int,
IsVerified bool,
Semester_id int,
PRIMARY KEY (Toefl_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/toefls/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Toefls WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('edit/' + req.params.Semester_id);
		}
	});
	var query = "SELECT * FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/toefls/create', {
			title: "TOEFL",
			result: results[0]
		});
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

		res.render('webforms/toefls/edit', {
			title: "Verify TOEFL Score",
			result: results[0]
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

//define recommendation class
/*
Recommendation_id int NOT NULL AUTO_INCREMENT,
Teacher_name varchar(255),
Attendence varchar(10),
Completion varchar(10),
Participation varchar(20),
Attitude varchar(20),
Recommendation_level int,
Comments varchar(255),
IsVerified bool,
Semester_id int,
PRIMARY KEY (Recommendation_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/
router.get('/recommendations/:Semester_id', function(req, res) {
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/recommendations/create', {
			title: "Teacher Recommendation",
			result: results[0]
		});
	});
});

router.post('/recommendations/:Semester_id', function(req, res) {
	var query = "INSERT INTO Recommendations SET ?";
	var recommendation = {
		Teacher_name: req.body.Teacher_name,
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

		res.render('webforms/recommendations/edit', {
			title: "Verify Teacher Recommendation",
			result: results[0]
		});
	});
});

router.post('/recommendations/edit/:Recommendation_id', function(req, res) {
	var query = "UPDATE Recommendations SET ? WHERE Recommendation_id = ?"
	var recommendation = {
		Teacher_name: req.body.Teacher_name,
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

//define timed_writing class
/*
Timed_writing_id int NOT NULL AUTO_INCREMENT,
Score varchar(5),
IsVerified bool,
Semester_id int,
PRIMARY KEY (Timed_writing_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
*/

router.get('/timed_writings/:Semester_id', function(req, res) {
	connection.query('SELECT * FROM Timed_writings WHERE Semester_id = ?', [req.params.Semester_id], function(err, counts) {
		if (counts.length != 0) {
			res.redirect('edit/' + req.params.Semester_id);
		}
	});
	var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id WHERE Semesters.Semester_id = ?"
	connection.query(query, [req.params.Semester_id], function(err, results) {
		if (err) throw err;

		res.render('webforms/timed_writings/create', {
			title: "Timed Writing",
			result: results[0]
		});
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

		res.render('webforms/timed_writings/edit', {
			title: "Verify Timed Writing Score",
			result: results[0]
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

module.exports = router;