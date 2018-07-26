var db = require('../db');

/**
 * { }
 */
function queryAddress(address, done) {
  knex.select('p').
  var query = `
    select *
    from parcel p
    where
      p.HOUSENUM = ? and (
        p.PIN      like ? or
        p.FRACTION like ? or
        p.ADDRESS  like ? or
        p.CITY     like ? or
        p.STATE    like ? or
        p.UNIT     like ? or
        p.ZIP      like ?
      )
    limit 20;`;

  db.getConnection(function (err, conn) {
    if (err) return done(err);
    var params = [
      `%${address.PIN}%`,
      // `%${address.HOUSENUM}%`,
      address.HOUSENUM || null,
      `%${address.FRACTION}%`,
      `%${address.ADDRESS}%`,
      `%${address.CITY}%`,
      `%${address.STATE}%`,
      `%${address.UNIT}%`,
      `%${address.ZIP}%`
    ];
    console.log("querying", db.mysql.format(query, params));
    conn.query(query, params, function (err, results) {
      conn.release();
      if (err) return done(err);

      done(null, results);
    });
  });
}

function queryLandlord(id, show, page, done) {
  var query = `
    select * from landlord l
    inner join parcel p on p.landlord_id = l.id
    where l.id = ?
    limit ?
    offset ?;`;

  var offset = show * (page - 1);
  var params = [
    id, show, offset
  ];

  db.getConnection(function (err, conn) {
    if (err) { return done(err); }

    console.log("running query", db.mysql.format(query, params));
    conn.query(query, params, (err, res) => {
      if (err) {
        conn.release();
        return done(err);
      }

      conn.query(`
        select count(*) as 'count' from landlord l
        inner join parcel p on p.landlord_id = l.id
        where l.id = ?`, [id], function (err, countRes) {
          conn.release();
          if (err) { return done(err); }

          done(null, {res, total: countRes[0].count });
        });
    });
  });
}

// queryAddress({ PIN: '0129G00076000000', HOUSENUM: 207 }, function (err, results) {
//   // console.log(err, results);
//   var landlord = results[0].landlord_id;
//   console.log("landlord is", landlord);
//   queryLandlord(landlord, 10, 1, function (err, res) {
//     console.log(err, res);
//     queryLandlord(landlord, 10, 2, function (err, res) {
//       console.log(err, res);
//     });
//   });
// });

module.exports = {
  queryAddress, queryLandlord
};

/*
select PIN, HOUSENUM, FRACTION, ADDRESS, CITY, STATE, UNIT, ZIP from parcel limit 20;
+------------------+----------+----------+--------------+------------+-------+------+-------+
| PIN              | HOUSENUM | FRACTION | ADDRESS      | CITY       | STATE | UNIT | ZIP   |
+------------------+----------+----------+--------------+------------+-------+------+-------+
| 0129G00076000000 |      207 |          | PHILANDER ST | PITTSBURGH | PA    |      | 15218 |
| 0095E00295000000 |     2055 |          | JACOB ST     | PITTSBURGH | PA    |      | 15226 |
| 0076K00128000000 |     3200 |          | CENTRAL AVE  | PITTSBURGH | PA    |      | 15212 |
| 0004S00262000000 |        0 |          | PASADENA ST  | PITTSBURGH | PA    |      | 15211 |
| 0116N00017000000 |     3421 |          | PORTOLA AVE  | PITTSBURGH | PA    |      | 15214 |
| 0047S00223000000 |     1413 |          | LAGER ST     | PITTSBURGH | PA    |      | 15212 |
| 0033K00038000000 |      309 |          | WILBUR ST    | PITTSBURGH | PA    |      | 15210 |
| 0019D00131000000 |      138 |          | STEUBEN ST   | PITTSBURGH | PA    |      | 15220 |
| 0015A00009000000 |        0 |          | HIBBS ST     | PITTSBURGH | PA    |      | 15211 |
| 0019M00087000000 |      152 |          | WABASH ST    | PITTSBURGH | PA    |      | 15220 |
| 0003H00233000000 |     1208 |          | MURIEL ST    | PITTSBURGH | PA    |      | 15203 |
| 0115H00012000000 |     3860 |          | EAST ST      | PITTSBURGH | PA    |      | 15214 |  // good one, 12
| 0075B00086000000 |     3586 |          | ELMHURST AVE | PITTSBURGH | PA    |      | 15212 |
| 0004P00077000000 |      455 |          | NORTON ST    | PITTSBURGH | PA    |      | 15211 |
| 0120K00141000000 |     6020 |          | BUTLER ST    | PITTSBURGH | PA    |      | 15201 |
| 0062S00073000000 |      825 |          | ROSSMORE AVE | PITTSBURGH | PA    |      | 15226 |
| 0012S00330000000 |      143 |          | S 25TH ST    | PITTSBURGH | PA    |      | 15203 |
| 0075B00104000000 |     1703 |          | TERMON AVE   | PITTSBURGH | PA    |      | 15212 |
| 0010K00054000000 |     2168 |          | WYLIE AVE    | PITTSBURGH | PA    |      | 15219 |
| 0015K00184000000 |       17 |          | LAFFERTY AVE | PITTSBURGH | PA    |      | 15210 |
+------------------+----------+----------+--------------+------------+-------+------+-------+
*/
