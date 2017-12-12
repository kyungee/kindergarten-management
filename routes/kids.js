
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


// GET : KIDS PAGE
router.get('/', function(req, res, next) {
  var sendData = {}
  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  var stmt = 'SELECT * FROM KINDERGARTENER';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      sendData.kids = rows;
      res.render('kids', sendData);
    }
  })
});

router.get('/detail', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('kids_detail', sendData);
});

router.get('/detail/:idx', function(req, res, next) {
  var sendData = {}
  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  var idx = req.params.idx;

  var stmt = 'SELECT * FROM KINDERGARTENER WHERE idx="'+idx+'"';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      sendData.kid = rows[0];
      res.render('kids_detail', sendData);
    }
  })
});

router.get('/add', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('kids_add', sendData);
});

// POST : KIDS ADD PAGE
router.post('/add', upload.single('photo'), function(req, res, next) {
  var data = {
    'class': req.body.class,
    'name': req.body.name,
    'gender': req.body.gender,
    'birth_date': req.body.birthday,
    'address': req.body.address,
    'phone_num': req.body.phonenum,
    'photo': req.file.filename
  };

  var stmt = 'INSERT into KINDERGARTENER set ?';
  connection.query(stmt, data, function (err, result) {
    if (err){
      console.error(err);
      throw err;
    } else{
      res.redirect('/kids');
    }
  })
});

// GET : KIDS EDIT PAGE
router.get('/edit/:idx', function(req, res, next) {
  var sendData = {}
  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  var idx = req.params.idx;

  var stmt = 'SELECT * FROM KINDERGARTENER WHERE idx="'+idx+'"';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      sendData.kid = rows[0];

      if(rows[0].gender == 0) {
        sendData.male = 'checked';
        sendData.female = '';
      } else {
        sendData.male = '';
        sendData.female = 'checked';
      }
      res.render('kids_edit', sendData);
    }
  })
});

// POST : KIDS EDIT PAGE
router.post('/edit/:idx', upload.single('photo'), function(req, res, next) {
  var idx = req.params.idx;

  var data = {
    'class': req.body.class,
    'name': req.body.name,
    'gender': req.body.gender,
    'birth_date': req.body.birthday,
    'address': req.body.address,
    'phone_num': req.body.phonenum,
    'photo': req.file.filename
  };

  var stmt = 'UPDATE KINDERGARTENER SET ? WHERE idx="'+idx+'"';
  connection.query(stmt, data, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      res.redirect('/kids');
    }
  })
});

// GET : KIDS DELETE PAGE
router.get('/delete/:idx', function(req, res, next) {
  var idx = req.params.idx;

  var stmt = 'DELETE FROM KINDERGARTENER WHERE idx="'+idx+'"';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      res.redirect('/kids');
    }
  })
});

module.exports = router;
