-- 
-- read mysqlu
-- read mysqlp
-- 
-- mysql -u${mysqlu} -p${mysqlp} < import.sql
-- 
drop database if exists whoownswhat;
create database whoownswhat;
use whoownswhat;

drop table if exists parcel_all;
create table parcel_all (
  PIN varchar(20),
  geom text,

  -- PROPERTYHOUSENUM__asmt varchar(10), -- make sure no letters in warnings
  PROPERTYHOUSENUM__asmt int default null,
  PROPERTYFRACTION__asmt varchar(40),

  PROPERTYADDRESS__asmt varchar(40),
  PROPERTYCITY__asmt varchar(40),
  PROPERTYSTATE__asmt varchar(40),
  PROPERTYUNIT__asmt varchar(40),
  PROPERTYZIP__asmt int,

  MUNICODE__asmt int,
  MUNIDESC__asmt varchar(40),

  OWNERCODE__asmt int,
  OWNERDESC__asmt varchar(40),

  CLASS__asmt varchar(40),
  CLASSDESC__asmt varchar(40),

  USECODE__asmt int,
  USEDESC__asmt varchar(40),

  LOTAREA__asmt varchar(40),
  HOMESTEADFLAG__asmt varchar(40),
  CLEANGREEN__asmt varchar(40),
  FARMSTEADFLAG__asmt varchar(40),
  ABATEMENTFLAG__asmt varchar(40),
  SALEDATE__asmt varchar(40),
  CHANGENOTICEADDRESS1__asmt varchar(100),
  CHANGENOTICEADDRESS2__asmt varchar(100),
  CHANGENOTICEADDRESS3__asmt varchar(100),
  CHANGENOTICEADDRESS4__asmt varchar(100),
  unique key(PIN)
  );


-- 0129G00076000000,
-- "{
--   "coordinates": [
--     [
--       [
--         [
--           -79.9045480619638,
--           40.4205741334134
--         ],
--         [
--           -79.9044678573968,
--           40.420579833812
--         ],
--         [
--           -79.9044559322434,
--           40.42047356834
--         ],
--         [
--           -79.904806838939,
--           40.4204508064628
--         ],
--         [
--           -79.9048173523409,
--           40.4205550369696
--         ],
--         [
--           -79.9047277409854,
--           40.4205614276452
--         ],
--         [
--           -79.9046367795512,
--           40.4205678438844
--         ],
--         [
--           -79.9045480619638,
--           40.4205741334134
--         ]
--       ]
--     ]
--   ],
--   "type": "MultiPolygon"
-- }",

-- 207, ,PHILANDER ST,PITTSBURGH,PA, ,15218,114,14th Ward - PITTSBURGH,10,REGULAR,,RESIDENTIAL,
-- 010,SINGLE FAMILY,3750.0,HOM,,,,11-17-2011,207   PHILANDER ST   ,  ,PITTSBURGH PA  ,15218


\! echo "Loading data...";
LOAD DATA LOCAL INFILE 'parcel_data.csv'
  INTO TABLE parcel_all
  FIELDS TERMINATED BY ','
  optionally enclosed by '"'
  LINES TERMINATED BY '\r\n' IGNORE 1 LINES;


\! echo "Renaming fields...";
drop table if exists parcel;
create table parcel as
  select 
    PIN as PIN,

    PROPERTYHOUSENUM__asmt as HOUSENUM,
    PROPERTYFRACTION__asmt as FRACTION,

    PROPERTYADDRESS__asmt as ADDRESS,
    PROPERTYCITY__asmt as CITY,
    PROPERTYSTATE__asmt as STATE,
    PROPERTYUNIT__asmt as UNIT,
    PROPERTYZIP__asmt as ZIP,

    MUNICODE__asmt             as MUNICODE,
    MUNIDESC__asmt             as MUNIDESC,

    OWNERCODE__asmt            as OWNERCODE,
    OWNERDESC__asmt            as OWNERDESC,

    CLASS__asmt                as CLASS,
    CLASSDESC__asmt            as CLASSDESC,

    USECODE__asmt              as USECODE,
    USEDESC__asmt              as USEDESC,

    LOTAREA__asmt              as LOTAREA,
    HOMESTEADFLAG__asmt        as HOMESTEADFLAG,
    CLEANGREEN__asmt           as CLEANGREEN,
    FARMSTEADFLAG__asmt        as FARMSTEADFLAG,
    ABATEMENTFLAG__asmt        as ABATEMENTFLAG,
    SALEDATE__asmt             as SALEDATE,
    CHANGENOTICEADDRESS1__asmt as ADDRESS1,
    CHANGENOTICEADDRESS2__asmt as ADDRESS2,
    CHANGENOTICEADDRESS3__asmt as ADDRESS3,
    CHANGENOTICEADDRESS4__asmt as ADDRESS4
  from parcel_all;

alter table parcel add column id int auto_increment primary key first, auto_increment = 1;
alter table parcel add key(ADDRESS1, ADDRESS2, ADDRESS3, ADDRESS4);
alter table parcel modify column PIN varchar(20) not null;
alter table parcel add unique key(PIN);


\! echo "creating landlord  table: finding landlords...";
create table landlord as select distinct
  ADDRESS1, ADDRESS2, ADDRESS3, ADDRESS4
  from parcel;

\! echo "creating landlord  table: numbering landlords...";
alter table landlord add column id int auto_increment primary key first, auto_increment = 1;

\! echo "updating landlord ref   : add landlord_id...";
ALTER TABLE parcel ADD COLUMN landlord_id INT after SALEDATE;
\! echo "updating landlord ref   : normalizing...";
update parcel p
  join landlord l on (
    l.ADDRESS1 = p.ADDRESS1 and
    l.ADDRESS2 = p.ADDRESS2 and
    l.ADDRESS3 = p.ADDRESS3 and
    l.ADDRESS4 = p.ADDRESS4
    )
  SET p.landlord_id = l.id;


\! echo "updating landlord ref   : add foriegn key...";
ALTER TABLE parcel ADD FOREIGN KEY (landlord_id) REFERENCES landlord(id);

alter TABLE parcel
  drop column ADDRESS1, 
  drop column ADDRESS2, 
  drop column ADDRESS3,
  drop column ADDRESS4;


-- select count(*)
-- select address, num_props
-- from 
--   (select
--     count(PIN) as num_props,
--     concat(ADDRESS1, ADDRESS2, ADDRESS3, ADDRESS4) as address
--   from parcel
--   group by
--     ADDRESS1,
--     ADDRESS2,
--     ADDRESS3,
--     ADDRESS4
--     ) as t
--   -- order by
--   --   num_props desc) as t
-- where num_props > 5
-- order by address
-- limit 10;

-- select
--   ADDRESS1,
--   ADDRESS2,
--   ADDRESS3,
--   ADDRESS4
-- from parcel limit 10;
