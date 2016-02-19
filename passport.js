var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


module.exports = function(app) {
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  connection.query('SELECT * FROM Users WHERE UserID = ?', [user.UserID], function(err, user) {
	    if (user) {
	      done(err, user);  
	    }
	  });
	});

	passport.use(new LocalStrategy(function(username, password, done) {
		process.nextTick(function() {
		  connection.query('SELECT * FROM Users WHERE Username = ?', [username], function(err, user) {
		    if (err) {
		      return done(err);
		    }
		    if (!user) {
		      return done(null, false, {
		        message: 'Incorrect username.'
		      });
		    }
		    if (user[0].Password != password) {
		      return done(null, false, {
		      	message: 'Invalid password.'
		      });
		    }
		    return done(null, user[0]);
		  });			
		});
	}));	
};