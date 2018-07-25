var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : process.env['mysqlu'] || 'whoownswhat',
  password        : process.env['mysqlp'] || 'whoownswhat',
  database        : 'whoownswhat'
});

module.exports = pool;
module.exports.mysql = mysql;
