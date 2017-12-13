
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

  res.render('health', sendData);
});

router.get('/detail', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  var stmt = 'select k.class, count(*) as cnt from kindergartener k inner join diseasecare d on d.id = k.idx group by k.class;';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      sendData.class_stats = rows;

      var stmt = 'select k.class, k.name, k.birth_date, d.disease_name from kindergartener k inner join diseasecare d on d.id = k.idx;';
      connection.query(stmt, function (err, rows) {
        console.log("rows : " + JSON.stringify(rows));
        if (err){
          console.error(err);
          throw err;
        } else{
          sendData.kids = rows;

          var stmt = 'select b.class, round((b.cnt/a.cnt)*100, 2) as cnt from ( select class, count(*) cnt from kindergartener group by class) a, (select k.class, count(*) cnt from kindergartener k inner join diseasecare d on d.id = k.idx group by k.class) b where a.class = b.class;';
          connection.query(stmt, function (err, rows) {
            console.log("rows : " + JSON.stringify(rows));
            if (err){
              console.error(err);
              throw err;
            } else{
              sendData.graph = rows;
              res.render('health_detail', sendData);
            }
          })
        }
      })
    }
  })
});

// GET : ALLERGY PAGE
router.get('/allergy', function(req, res, next) {
  var sendData = {}
  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  sendData.result = {};
  res.render('allergy', sendData);
});

// POST : ALLERGY PAGE
router.post('/allergy', function(req, res, next) {
  var sendData = {}
  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  sendData.result = null;

  var data = req.body.allergy;
  if (data.length == 0) {
    res.redirect('/health/allergy');
  } else {
    var query = 'allergy_name="'+data[0]+'"';

    for(var i=1; i<data.length; i++) {
      query += ' or allergy_name="'+ data[i] +'"';
    }

    var stmt = 'select k.idx, k.class, k.name, k.photo, a.allergy_name from allergycare a, kindergartener k where a.id=k.idx and ('+query+');';
    connection.query(stmt, function (err, rows) {
      console.log("rows : " + JSON.stringify(rows));
      if (err){
        console.error(err);
        throw err;
      } else{
        sendData.result = rows;
        res.render('allergy', sendData);
      }
    })
  }
});

module.exports = router;
