var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('kids', { title: 'Express'});
});

router.get('/detail', function(req, res, next) {
  res.render('kids_detail', {});
});

module.exports = router;
