
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
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  res.render('classes', sendData);
});

router.get('/detail/:idx', function(req, res, next) {
  var sendData = {}
  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  var idx = req.params.idx;

  var stmt = 'SELECT * FROM CLASS WHERE idx="'+idx+'"';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      sendData.class_info = rows[0];

      var stmt = 'select u.name, u.photo from class c, user u where c.teacher_idx=u.type and c.idx="'+idx+'"';
      connection.query(stmt, function (err, rows) {
        console.log("rows : " + JSON.stringify(rows));
        if (err){
          console.error(err);
          throw err;
        } else{
          sendData.teacher = rows[0];
          var stmt = 'select * from kindergartener where class="'+sendData.class_info.name+'"';
          connection.query(stmt, function (err, rows) {
            console.log("rows : " + JSON.stringify(rows));
            if (err){
              console.error(err);
              throw err;
            } else{
              sendData.kids = rows;
              console.log(sendData.kids.length);
              res.render('classes_detail', sendData);
            }
          })
        }
      })
    }
  })
});

module.exports = router;
