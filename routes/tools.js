var express = require('express');
var router = express.Router();

module.exports = function() {
	this.isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			req.session.error_message = "Please login first to use the system.";
			res.redirect('/login');
		}
	};

	this.renderWebformsIndex = function(webformType, req, res) {
		var query = "SELECT Semesters.Semester_id, Students.Student_number, Students.First_name, Students.Last_name, Semesters.Year, Semesters.Season, Semesters.Term, Semesters.Level, Semesters.Section FROM Semesters INNER JOIN Students ON Semesters.Student_id=Students.Student_id ORDER BY Students.Student_number";
		connection.query(query, function(err, results) {
			if (err) throw err;

			res.render('webforms/index', {
				title: "Choose a student record",
				rows: results,
				user: req.user[0],
				url: "/webforms",
				webformType: webformType
			});
		});
	};
};