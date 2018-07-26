var knex = require('knex')({ client: 'mysql' });

var addr1 = { pin: 1 };
var addr2 = { house: 2, ADDRESS: "'); drop table;" };


var kq = (function(a) {
  return knex
    .select('*')
    .from('parcel as p')
    .where(function() {
      if (a.ADDRESS) {
        this.whereRaw('p.ADDRESS like ?', [`%${a.ADDRESS}%`]);
        delete a.ADDRESS;
      }
    })
    .where(function () {
      this.where(a)
    });
})(addr2);
// kq = kq.where(function (builder) {
//   builder.whereRaw("pin like ?", ['%5%']).whereRaw("pin like ?", ['%5%'])
// });
// kq = kq.;
console.log(kq.toQuery());

var q = `
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

console.log(q);
