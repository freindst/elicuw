var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        var user = req.session.passport.user;
    } else {
        var user = null
    }
    res.render('index', {
        title: 'Home',
        url: req.originalUrl,
        user: user
    });
});


router.get('/sign_up', function(req, res) {
    if (req.session.hasOwnProperty('error_message')) {
        var error_message = req.session.error_message;
        delete req.session.error_message;
    }
    res.render('sign_up', {
        title: "Sign Up",
        error_message: error_message || null
    });
});

router.post('/sign_up', function(req, res) {
    var user = {
        Username: req.body.username,
        Password: req.body.password,
        email: req.body.email,
        User_group: req.body.user_group,
        isVerified: false,
    }

    connection.query('INSERT INTO Users SET ?', user, function(err, result) {
        if (err) {
            req.session.error_message = "Sign up failed.";
            res.redirect('/sign_up');
        } else {
            req.session.okay_message = "Sign Up Successfully. You can login now, but you need to wait for email verificatio by administrator."
            res.redirect('/login');
        }
    });
});

router.get('/initiate', function(req, res) {
    var connection = req.app.get('connection');
    connection.query('CREATE TABLE Students(' +
        'Student_id int(11) NOT NULL AUTO_INCREMENT,' +
        'Student_number varchar(9),' +
        'First_name varchar(100),' +
        'Last_name varchar(100),' +
        'Major varchar(100),' +
        'PRIMARY KEY(Student_id)' +
        ')', function(err, result) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Table Students created.")
        }
    })
});

router.get('/test', function(req, res) {
  res.redirect('verifications/interview')
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/try', isAuthenticated, function(req, res, next) {
    res.render('index', {title: "login"});
});

module.exports = router;
