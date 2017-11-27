var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('classes', { title: 'Express'});
});

router.get('/detail', function(req, res, next) {
  res.render('classes_detail', { title: 'Express'});
});

module.exports = router;
