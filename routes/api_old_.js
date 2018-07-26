var express = require('express');
var router = express.Router();

var dbf = require('../workbench/functions');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/address', function(req, res, next) {
  dbf.queryAddress({
    PIN      : req.body['PIN']      || '',
    HOUSENUM : req.body['HOUSENUM'] || '',
    FRACTION : req.body['FRACTION'] || '',
    ADDRESS  : req.body['ADDRESS']  || '',
    CITY     : req.body['CITY']     || '',
    STATE    : req.body['STATE']    || '',
    UNIT     : req.body['UNIT']     || '',
    ZIP      : req.body['ZIP']      || ''
  }, function (err, results) {
    console.log(results);
    res.json({});
  })
});

module.exports = router;
