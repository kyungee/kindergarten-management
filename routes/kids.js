
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

  res.render('kids', sendData);
});

router.get('/detail', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('kids_detail', sendData);
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
  console.log(req.file);
  var data = {
    'class': req.body.class,
    'name': req.body.name,
    'gender': req.body.gender,
    'birth_date': req.body.birthday,
    'address': req.body.address,
    'phone_num': req.body.phonenum,
    'photo': req.file.filename
  };
  console.log("#$$#$@$#@$"+data);
  var stmt = 'INSERT into KINDERGARTENER set ?';
  connection.query(stmt, data, function (err, result) {
    if (err){
      console.error(err);
      throw err;
    } else{
      console.log('bbbbb');
      res.redirect('/kids');
    }
  })
});

router.get('/edit', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('kids_edit', sendData);
});

module.exports = router;
