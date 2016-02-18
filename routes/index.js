var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

router.get('/test/:param', function(req, res) {
	res.send(req.params.param);
})

module.exports = router;
