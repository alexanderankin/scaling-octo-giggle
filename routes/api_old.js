var express = require('express');
var router = express.Router();

var fs = require('fs');
var readline = require('readline');

var FuzzySearch = require('fuzzy-search');

var words = [];
var searcher = null;
readline.createInterface({
  input: fs.createReadStream('/usr/share/dict/american-english'),
  terminal: false
}).on('line', function(line) {
  words.push(line);
}).on('close', function () {

  searcher = new FuzzySearch(words, [], {
    caseSensitive: true,
    sort: true
  });

  var con = require('repl').start().context
  con.m = matches;
  con.w = words;

});

function matches(word) {
  return (
    searcher
      ? searcher.search(word).slice(0, 20)
      : []
  );
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/suggestions', function(req, res, next) {
  var address = req.query.address;
  var suggestions = matches(address);
  console.log(suggestions);
  var suggestions = suggestions.map(function(s, i) { return { value: s, id: i }});
  res.json({
    suggestions
  });
});

function exist(word) {
  return words.indexOf(word) !== -1;
}

router.get('/address/exist', function(req, res, next) {
  var address = req.query.address;
  var exists = exist(address);
  res.json({
    exists
  });
});

router.post('/suggestions', function(req, res, next) {
  var address = req.body.address;
  var suggestions = matches(address);
  console.log(suggestions);
  var suggestions = suggestions.map(function(s, i) { return { value: s, id: i }});
  res.json({
    suggestions
  });
});

module.exports = router;
