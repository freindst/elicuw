var express = require('express');
var router = express.Router();

//tools.js contains global functions
var tools = require('./tools.js')();

/* GET home page. */
router.get('/', function(req, res) {
    renderScreen(req, res, 'index', {
        title: 'Home',
        url: '/'
    });
});

//User sign up view
router.get('/sign_up', function(req, res) {
    renderScreen(req, res, 'sign_up', {
        title: 'Sign Up',
        url: null
    })
});

//sign up new user put into database
router.post('/sign_up', function(req, res) {
    var user = {
        Username: req.body.username,
        Password: req.body.password,
        email: req.body.email,
        User_group: req.body.user_group,
        isVerified: false,
    };

    connection.query('INSERT INTO Users SET ?', user, function(err, result) {
        if (err) {
            req.session.error_message = "Sign up failed.";
            res.redirect('/sign_up');
        } else {
            req.session.okay_message = "Sign Up Successfully. You can login now, but you need to wait for account verification by system administrator."
            res.redirect('/login');
        }
    });
});

module.exports = router;
