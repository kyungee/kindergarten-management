
var express = require('express');
var mysql = require('mysql');

var nodemailer = require('nodemailer');

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

// GET : MAIL PAGE
router.get('/', function(req, res, next) {
  var sendData = {}

  if(req.session)
    sendData.mem_name = req.session.name;
  else
    sendData.mem_name = null;

  var stmt = 'SELECT name, email FROM KINDERGARTENER';
  connection.query(stmt, function (err, rows) {
    console.log("rows : " + JSON.stringify(rows));
    if (err){
      console.error(err);
      throw err;
    } else{
      sendData.kids = rows;
      res.render('mail', sendData);
    }
  })
});

// POST : MAIL PAGE
router.post('/', function(req, res, next) {
  var data = {
    'to': req.body.to,
    'title': req.body.title,
    'contents': req.body.contents
  };

  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'violet3073@gmail.com',
        pass: 'jiyun656000'
    }
  });

  for(var i=0; i < data.to.length; i++){
    var mailOptions = {
      from: '경희유치원 <violet3073@gmail.com>',
      to: data.to[i],
      subject: data.title,
      html: data.contents
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
      if (error){
          console.log(error);
      } else {
          console.log("gsgg");
          console.log("Message sent : " + response.message);
      }
      smtpTransport.close();
    });
  }

  res.redirect('/mail');

});

module.exports = router;
