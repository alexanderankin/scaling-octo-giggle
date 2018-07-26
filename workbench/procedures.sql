-- -- select count(*)
-- select address, num_props
-- from 
--   (select
--     count(p.PIN) as num_props,
--     concat(l.ADDRESS1, l.ADDRESS2, l.ADDRESS3, l.ADDRESS4) as address
--   from parcel p
--   join landlord l on l.id = p.landlord_id
--   group by p.landlord_id
--   order by
--     num_props desc) as t
-- order by address
-- where num_props > 5
-- limit 10;

-- -- select
-- --   ADDRESS1,
-- --   ADDRESS2,
-- --   ADDRESS3,
-- --   ADDRESS4
-- -- from parcel limit 10;


-- -- select 

select t.lid, t.address, t.num_props
from
  (select
      p.landlord_id as lid,
      count(p.PIN) as num_props,
      concat(l.ADDRESS1, ":", l.ADDRESS2, ":", l.ADDRESS3, ":", l.ADDRESS4) as address
    from parcel p
    join landlord l on l.id = p.landlord_id
    group by p.landlord_id) as t
where t.num_props > 5
order by t.num_props desc
limit 10;


-- select p.HOUSENUM, p.ADDRESS, p.id as pid, p.landlord_id as lid, (select count(*) from parcel where parcel.landlord_id = lid) from parcel p where p.ADDRESS = 'melwood ave' and p.housenum < 1000 order by p.housenum;
