var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('interviews/create', {
		title: "interviews"
	});
});