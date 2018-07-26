var express = require('express');
var router = express.Router();

var dbf = require('../workbench/functions');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/address', function(req, res, next) {
  var address = {
    PIN      : req.body['PIN']      || null,
    HOUSENUM : req.body['HOUSENUM'] || null,
    FRACTION : req.body['FRACTION'] || null,
    ADDRESS  : req.body['ADDRESS']  || null,
    CITY     : req.body['CITY']     || null,
    STATE    : req.body['STATE']    || null,
    UNIT     : req.body['UNIT']     || null,
    ZIP      : req.body['ZIP']      || null
  };

  Object.keys(address).forEach((key) => 
    (address[key] == null) && delete address[key]
  );

  dbf.queryAddress(address, function (err, results) {
    if (err) { return next(err); }

    res.json({ suggestions: results });
  })
});

router.get('/landlord', function (req, res, next) {
  var landlord_id = req.query['landlord_id'];

  dbf.queryLandlord(landlord_id, 10, 1, function (err, results) {
    if (err) return next(err);

    res.json({ results });
  });
});

router.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).json({ err: err + '' });
});

module.exports = router;
