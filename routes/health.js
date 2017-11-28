var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('health', { title: 'Express'});
});

router.get('/allergy', function(req, res, next) {
  res.render('allergy', { title: 'Express'});
});

module.exports = router;
