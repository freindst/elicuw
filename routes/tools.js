var express = require('express');
var router = express.Router();

//export global functions
module.exports = function() {
	//middleware: check whether current client has logged in the system. If not, jump to login page.
	this.isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			req.session.error_message = "Please login first to use the system.";
			req.session.returnTo = req.originalUrl;
			res.redirect('/login');
		}
	};

	//middleware: check whether the user has been verified. If not, jump back to homepage.
	this.isVerified = function(req, res, next) {
		var user = req.user[0];
		if (user.isVerified == '1') {
			next();
		} else {
			req.session.error_message = "Please wait for administrator verifying your account, or contact administrator right now.";
			res.redirect('/');
		}
	}

	//middleware: check whether the user is admin. if not, reject the request and go back to orginal screen.
	this.isAdmin = function(req, res, next) {
		var user = req.user[0];
		if ((user.User_group == 'admin' ) || (user.User_group == 'super_user' )) {
			next();
		} else {
			req.session.error_message = "Sorry. Only administrator is allowed to access this funciton.";
			res.redirect('/');
		}
	}


	//group user info passing, messages display and screen render together
	this.renderScreen = function(req, res, view, options) {
/*		var options = {
			title: 'Home',
			url: '/'
		}*/
		//if user has logged in, assign req.user[0] to variable user
		if (req.isAuthenticated()) {
			options.user = req.user[0];
		}
		//if previous page has passed a meesage in session, render it.
		if (req.session.hasOwnProperty('okay_message')) {
			options.okay_message = req.session.okay_message;
			delete req.session.okay_message;
		}
		//if previous page has passed an error meesage in session, render it.
		if (req.session.hasOwnProperty('error_message')) {
			options.error_message = req.session.error_message;
			delete req.session.error_message;
		}
		res.render(view, options)
	}

	//statistic table
/*	CREATE TABLE Count_unverified (
	ID int NOT NULL AUTO_INCREMENT,
	Interviews int DEFAULT 0,
	Timed_writings int DEFAULT 0,
	Toefls int DEFAULT 0,
	Readings int DEFAULT 0,
	Speakings int DEFAULT 0,
	Writings int DEFAULT 0,
	Toefl_preps int DEFAULT 0,
	Extensive_listenings int DEFAULT 0,
	Recommendations int DEFAULT 0,
	PRIMARY KEY (ID)
	);*/

	this.Count_unverified_change = function(TableName, option) {
		var query = 'UPDATE Count_unverified SET ' + TableName + '=' +  TableName + option + '1 WHERE ID = 1';
		connection.query(query, function(err, result) {
			if (err) throw err;
		});
	}

	//Interview convertion formula
	this.Convert_Score_Interviews = function(Recommendations) {
		var sum = 0;
		for (var i in Recommendations) {
			sum += Recommendations[i].Recommendation;
		}
		sum = Math.ceil(sum /Recommendations.length * 3);
		var score = 0;
		switch (sum) {
	    case 1:
	        score = 2;
	        break;
	    case 2:
	        score = 2
	        break;
	    case 3:
	        score = 3;
	        break;
	    case 4:
	        score = 5;
	        break;
	    case 5:
	        score = 8;
	        break;
	    case 6:
	        score = 10;
	        break;
	    case 7:
	    	score = 13;
	    	break;
	    case 8:
	    	score = 17;
	    	break;
	    case 9:
	    	score = 20;
	    	break;
	    default:
	    	score = 0;
		}
		return score;
	}

	this.Update_Result_Interview = function(Semester_id) {
		//update score in final_interviews and Exit_report
		connection.query('SELECT Recommendation FROM Interviews WHERE Semester_id = ? AND IsVerified = 1', [Semester_id], function(err, Recommendations) {

			var score = 0;

			if (Recommendations.length != 0) {
				score = Convert_Score_Interviews(Recommendations);;
			}

			connection.query('UPDATE Final_interview SET ? WHERE Semester_id = ?', [{Score: score}, Semester_id], function(err, result) {
			});

			connection.query('SELECT * FROM Exit_reports WHERE Semester_id = ?', [Semester_id], function(err, result3) {
				if (result3.length == 0) {
					var option = [
					{Semester_id: Semester_id,Interview: score,Result: score},
					score
					];
				} else {
					var Result = result3[0].Teacher_recommendation + result3[0].Timed_writing + result3[0].Grades + result3[0].Toefl + score;
					var option = [
					{Semester_id: Semester_id,Interview: score,Result: Result},
					score
					];
				}
				connection.query('INSERT INTO Exit_reports SET ? ON DUPLICATE KEY UPDATE Interview = ?', option, function(err, result) {
					if (err) throw err;
				});					
			});
		});
	}
	
};