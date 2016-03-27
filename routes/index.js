var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

//tools.js contains global functions
var tools = require('./tools.js')();

/* GET home page. */
router.get('/', function(req, res) {
    renderScreen(req, res, 'index', {
        title: 'Home',
        url: '/'
    });
});

router.get('/test/:aa', function(req, res) {
    var aa = req.params.aa;
    bcrypt.hash(aa, null, null, function(err, hash) {
        res.send(hash);
    })
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
    if (req.body.password != req.body.re_password) {
        req.session.error_message = "Passwords doese not match! Please complete sign up again."
        res.redirect('/sign_up');
    } else {
        bcrypt.hash(req.body.password, null, null, function(err, hash) {
            if (err) throw err;

            var user = {
                Username: req.body.username,
                Password: hash,
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
    }
});

router.get('/return', function(req, res) {
    var returnUrl = '/';
    if ((req.session.hasOwnProperty('returnTo')) && (req.session.returnTo != null)) {
        returnUrl = req.session.returnTo;
        delete req.session.returnTo
    }
    res.redirect(returnUrl);
});

module.exports = router;
