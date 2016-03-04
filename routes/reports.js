var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('reports/index',
	{
		title: 'Report'
	});
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

router.get('/exit_report', function(req, res) {
	connection.query('SELECT * FROM Exit_reports INNER JOIN Semesters ON Exit_reports.Semester_id = Semesters.Semester_id INNER JOIN Students on Semesters.Student_id=Students.Student_id', function(err, results) {
		console.log(results);
		res.render('reports/exit_report',
		{
			title: 'Exit Report List',
			rows: results
		});		
	});
});

router.get('/test', function(req, res) {
	var query = connection.query('SELECT Semester_id FROM Semesters');
	query.on('result', function(semesters) {
		for (var i in semesters) {
			connection.query('SELECT * FROM Recommendations WHERE Semester_id = ?', [semesters[i]], function(err, results) {
				if (results.length != 0)
				{
					var raw_score = '';
					var score = 0;
					for (var n in results) {
						raw_score += parseFloat(results[n].Recommendation_level);
						if (n < (results.length -1))
						{
							raw_score += ',';
						}
						score += (parseFloat((results[n].Recommendation_level)/results.length));
					}
					var recommendation = {
						Semester_id: semesters[i],
						Raw_score: '[' + raw_score +']',
						Final_score: score
					};
/*
create table Final_Recommendation 
(Final_Recommendation_id int NOT NULL AUTO_INCREMENT,
Semester_id int UNIQUE,
Raw_score varchar(255),
Final_score varchar(10),
PRIMARY KEY (Final_Recommendation_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/
					connection.query('INSERT INTO Final_Recommendation SET ? ON DUPLICATE KEY UPDATE Raw_score = ? AND Final_score = ?', [recommendation, recommendation.Raw_score, recommendation.Final_score], function(err, result) {
						if (err) throw err;
					});
				}				
			});
			connection.query('SELECT * FROM Readings INNER JOIN Speakings ON Readings.Semester_id = Speakings.Semester_id INNER JOIN Writings ON Speakings.Semester_id = Writings.Semester_id WHERE Writings.Semester_id = ?', [semesters[i]], function(err, results) {
				if (results.length != 0)
				{
					var raw_grade = '{Reading_score:' + results[0].Reading_score + ';Speaking_score:' + results[0].Speaking_score + ';Writing_score:' + results[0].Writing_score+'}';
					var grade = (parseFloat(results[0].Reading_score) + parseFloat(results[0].Speaking_score) + parseFloat(results[0].Writing_score))/3;
/*
create table Final_Grade
(Final_Grade_id int NOT NULL AUTO_INCREMENT,
Semester_id int UNIQUE,
Raw_grade varchar(255),
Final_grade varchar(10),
PRIMARY KEY (Final_Grade_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/
					connection.query('INSERT INTO Final_Grade (Semester_id, Raw_grade, Final_grade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Raw_grade = ? AND Final_grade = ?', [semesters[i], raw_grade, grade, raw_grade, grade], function(err, result) {
						if (err) throw err;
					});
				}
			});
			connection.query('SELECT Final_Grade.Semester_id, Final_Grade.Final_grade, Final_Recommendation.Final_score, Interviews.Recommendation, Timed_writings.Score, Toefls.Listening FROM Final_Grade INNER JOIN Final_Recommendation ON Final_Grade.Semester_id = Final_Recommendation.Semester_id INNER JOIN Interviews ON Final_Grade.Semester_id = Interviews.Semester_id INNER JOIN Timed_writings ON Final_Grade.Semester_id = Timed_writings.Semester_id INNER JOIN Toefls ON Final_Grade.Semester_id = Toefls.Semester_id WHERE Final_Grade.Semester_id = ?', [semesters[i]], function(err, results) {
				if (err) throw err;
				if (results.length != 0)
				{
					var total = parseFloat(results[0].Final_grade) + parseFloat(results[0].Final_score) + parseFloat(results[0].Recommendation) + parseFloat(results[0].Score) + parseFloat(results[0].Listening);
					console.log(total);
					var item = {
						Semester_id: semesters[i],
						Teacher_recommendation: results[0].Final_score,
						Timed_writing: results[0].Score,
						Grades: results[0].Final_grade,
						Interview: results[0].Recommendation,
						Toefl: results[0].Listening,
						Result: total
					};
					console.log(item);
					connection.query('INSERT INTO Exit_reports SET ? ON DUPLICATE KEY UPDATE ?', [item, item], function(err, result) {
						if (err) throw err;
					})
				}
			})
		}
	})
	.on('end', function() {
		res.send('in testing');
	})
	
});


router.get('/refresh', function(req, res) {
	var query = connection.query('SELECT Semester_id FROM Semesters');
	query.on('result', function(semesters) {
		for (var i in semesters) {
			connection.query('SELECT * FROM Recommendations WHERE Semester_id = ?', [semesters[i]], function(err, results) {
				if (results.length != 0)
				{
					var raw_score = '';
					var score = 0;
					for (var n in results) {
						raw_score += parseFloat(results[n].Recommendation_level);
						if (n < (results.length -1))
						{
							raw_score += ',';
						}
						score += (parseFloat((results[n].Recommendation_level)/results.length));
					}
					var recommendation = {
						Semester_id: semesters[i],
						Raw_score: '[' + raw_score +']',
						Final_score: score
					};
/*
create table Final_Recommendation 
(Final_Recommendation_id int NOT NULL AUTO_INCREMENT,
Semester_id int UNIQUE,
Raw_score varchar(255),
Final_score varchar(10),
PRIMARY KEY (Final_Recommendation_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/
					connection.query('INSERT INTO Final_Recommendation SET ? ON DUPLICATE KEY UPDATE Raw_score = ? AND Final_score = ?', [recommendation, recommendation.Raw_score, recommendation.Final_score], function(err, result) {
						if (err) throw err;
					});
				}				
			});
			connection.query('SELECT * FROM Readings INNER JOIN Speakings ON Readings.Semester_id = Speakings.Semester_id INNER JOIN Writings ON Speakings.Semester_id = Writings.Semester_id WHERE Writings.Semester_id = ?', [semesters[i]], function(err, results) {
				if (results.length != 0)
				{
					var raw_grade = '{Reading_score:' + results[0].Reading_score + ';Speaking_score:' + results[0].Speaking_score + ';Writing_score:' + results[0].Writing_score+'}';
					var grade = (parseFloat(results[0].Reading_score) + parseFloat(results[0].Speaking_score) + parseFloat(results[0].Writing_score))/3;
/*
create table Final_Grade
(Final_Grade_id int NOT NULL AUTO_INCREMENT,
Semester_id int UNIQUE,
Raw_grade varchar(255),
Final_grade varchar(10),
PRIMARY KEY (Final_Grade_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/
					connection.query('INSERT INTO Final_Grade (Semester_id, Raw_grade, Final_grade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Raw_grade = ? AND Final_grade = ?', [semesters[i], raw_grade, grade, raw_grade, grade], function(err, result) {
						if (err) throw err;
					});
				}
			});
			connection.query('SELECT Final_Grade.Semester_id, Final_Grade.Final_grade, Final_Recommendation.Final_score, Interviews.Recommendation, Timed_writings.Score, Toefls.Listening FROM Final_Grade INNER JOIN Final_Recommendation ON Final_Grade.Semester_id = Final_Recommendation.Semester_id INNER JOIN Interviews ON Final_Grade.Semester_id = Interviews.Semester_id INNER JOIN Timed_writings ON Final_Grade.Semester_id = Timed_writings.Semester_id INNER JOIN Toefls ON Final_Grade.Semester_id = Toefls.Semester_id WHERE Final_Grade.Semester_id = ?', [semesters[i]], function(err, results) {
				if (err) throw err;
				if (results.length != 0)
				{
					var total = parseFloat(results[0].Final_grade) + parseFloat(results[0].Final_score) + parseFloat(results[0].Recommendation) + parseFloat(results[0].Score) + parseFloat(results[0].Listening);
					var item = {
						Semester_id: semesters[i],
						Teacher_recommendation: results[0].Final_score,
						Timed_writing: results[0].Score,
						Grades: results[0].Final_grade,
						Interview: results[0].Recommendation,
						Toefl: results[0].Listening,
						Result: total
					};
					connection.query('INSERT INTO Exit_reports SET ? ON DUPLICATE KEY UPDATE ?', [item, item], function(err, result) {
						if (err) throw err;
					});
				}
			});
		}
	})
	  .on('end', function() {
	  	res.redirect('/reports/exit_report');
	  });
});

module.exports = router;