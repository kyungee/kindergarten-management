
var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var multer = require('multer');

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


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf()+"-"+file.originalname)
  }
})

var upload = multer({ storage: storage })


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
router.post('/register', upload.single('photo'), function(req, res, next) {
  var user = {
    'id': req.body.id,
    'pw': req.body.pw,
    'name': req.body.name,
    'type': req.body.class,
    'phone_num': req.body.phonenum,
    'email': req.body.email,
    'address': req.body.address,
    'photo': req.file.filename
  };

  var stmt = 'INSERT into USER set ?';
  connection.query(stmt, user, function (err, result) {
    if (err){
      console.error(err);
      throw err;
    } else{
      res.redirect('/login');
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
    'id': req.body.id,
    'pw': req.body.pw
  };

  var stmt = 'SELECT * FROM USER WHERE id="'+user.id+'" and pw="'+user.pw+'"';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      req.session.id = rows[0]['id'];
      req.session.name = rows[0]['name'];
      res.redirect('/');
    }
  })
});


// GET : LOGOUT PAGE
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(){
    req.session;
  });

  res.redirect('/');
});

module.exports = router;
