
var express = require('express');
var mysql = require('mysql');
var session = require('express-session');

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
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('index', sendData);
});

// GET : REGISTER PAGE
router.get('/register', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('register', sendData);
});

// POST : REGISTER PAGE
router.post('/register', function(req, res, next) {
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

// GET : LOGIN PAGE
router.get('/login', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('login', sendData);
});

// POST : LOGIN PAGE
router.post('/login', function(req, res, next) {
  var user = {
    'userid': req.body.userid,
    'pw': req.body.pw
  };

  var stmt = 'SELECT * FROM USER WHERE user_id="'+user.userid+'" and pw="'+user.pw+'"';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      req.session.user_id = rows[0]['user_id'];
      req.session.name = rows[0]['name'];
      res.redirect('/');
    }
  })
});

module.exports = router;
