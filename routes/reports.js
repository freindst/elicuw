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
Semester_id int,
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
Semester_id int,
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
		}
	})
	.on('end', function() {
		res.send('in testing');
	})
	
});


router.get('/refresh', function(req, res) {
	var query = connection.query('SELECT Semester_id FROM Semesters');
	query
	  .on('result', function(semesters) {
	  	for (var i in semesters) {
	  		var result = [];
	  		//recommendation
	  		connection.query('SELECT * FROM Recommendations WHERE Semester_id = ?', [semesters[i]], function(err, results) {
	  			console.log(results);
					var raw_score = [];
					var score = 0;
					for (var n in results) {
						raw_score.push({recommendation_level: parseFloat(results[n])});
						console.log(raw_score);
						score += (parseFloat(results[n]/n));
					};

					var recommendation = {
						Semester_id: semesters[i],
						Raw_score: raw_score,
						Final_score: score + ''
					};
					console.log(recommendation)
/*
create table Final_Recommendation 
(Final_Recommendation_id int NOT NULL AUTO_INCREMENT,
Semester_id int,
Raw_score varchar(255),
Final_score varchar(10),
PRIMARY KEY (Final_Recommendation_id),
FOREIGN KEY (Semester_id) REFERENCES Semesters(Semester_id)
);
*/
					connection.query('INSERT INTO Final_Recommendation SET', recommendation, function(err, result) {
						console.log(err);

					});
			});
	  	}
	  })
	  .on('end', function() {
	  	res.redirect('/reports/exit_report');
	  })
	/*connection.query('SELECT Semester_id FROM Semesters', function(err, semesters) {
		for (var i in semesters) {
			var result = [];
			//recommendation
			connection.query('SELECT Reommndation FROM Recommendations WHERE Semester_id = ?', [semesters[i].Semester_id], function(err, results) {
					var score = 0;
					for (var n in results) {
						score += parseFloat(results[n])/n;
					};

					result.push(Math.round(score));
			});

			//Timed_writing
			connection.query('SELECT Score From Timed_writings WHERE Semester_id = ?', [semesters[i].Semester_id], function(err, results) {
					var score = parseFloat(results[0]);
					result.push(Math.round(score));
			});

			//Grades
			connection.query('SELECT Readings.Reading_socre, Writings.Writing_score, Speaking.Speaking_score FROM Readings INNER JOIN Writings ON Readings.Semester_id = Writings.Semester_id INNER JOIN Speakings ON Writings.Semester_id = Speakings.Semester_id WHERE Readings.Semester_id = ?', [semesters[i].Semester_id], function(err, results) {
				var score = (parseFloat(results[0].Reading_socre) + parseFloat(results[0].Writing_score) + parseFloat(results[0].Speaking_score))/3;
				result.push(Math.round(score));
			});

			//Interview
			connection.query('SELECT Recommendation FROM Interviews WHERE Interviews.Semester_id = ?', [semesters[i].Semester_id], function(err, results) {
					var score = parseFloat(results[0].Recommendation);
					result.push(Math.round(score));
			});

			//TOEFL
			connection.query('SELECT Listening, Reading, Grammar FROM Toefls WHERE Toefls.Semester_id = ?', [semesters[i].Semester_id], function(err, results) {
					var score = (parseFloat(results[0].Listening) + parseFloat(results[0].Reading) + parseFloat(results[0].Grammar))/3;
					result.push(Math.round(score));
			});

			var final_score = result[0] + result[1] + result[2] + result[3] + result[4];
			var item = {
				Semester_id: semesters[i].Semester_id,
				Teacher_recommendation: result[0],
				Timed_writing: result[1],
				Grades: result[2],
				Interview: result[3],
				Toefl: result[4],
				Result: final_score
			};
			connection.query('INSERT INTO Exit_reports SET ?', item, function(err, respond) {});
		}
		res.redirect('/reports/exit_report');
	});*/
});

module.exports = router;