var express = require('express');
var router = express.Router();

var i=0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('kids', { title: 'Express' , var_i: i});
});

module.exports = router;
