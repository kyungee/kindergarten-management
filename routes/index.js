
var express = require('express');
var mysql = require('mysql');

var mysql_dbc = require('../config/db_info.js');
var connection = mysql.createConnection(mysql_dbc);

var router = express.Router();

connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

// GET : REGISTER PAGE
router.get('/register', function(req, res, next) {
  res.render('register');
});

// POST : REGISTER PAGE
router.post('/register', function(req, res, next) {
  console.log('aaa');
  var user = {
    'user_id': req.body.userid,
    'pw': req.body.pw,
    'name': req.body.username,
    'type': req.body.class,
    'phone_num': req.body.phonenum,
    'email': req.body.email,
    'address': req.body.address
  };

  var stmt = 'INSERT into USER set ?';
  connection.query(stmt, user, function (err, result) {
    if (err){
      console.error(err);
      throw err;
    } else{
      res.render('login');
    }
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express'});
});

module.exports = router;
