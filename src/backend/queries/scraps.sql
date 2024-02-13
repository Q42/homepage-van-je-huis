INSTALL spatial; LOAD spatial;

create table bomen as SELECT * from "/Users/thomas/Projects/homepage-van-je-huis/src/backend/intermediate_output/bomen.parquet";
create table adressen as SELECT * from "/Users/thomas/Projects/homepage-van-je-huis/src/backend/intermediate_output/adressen.parquet";
alter table adressen alter geometrie set
data type GEOMETRY
	USING ST_GeomFromText(geometrie);


describe bomen


alter table bomen alter rd_geometrie_bomen set
data type GEOMETRY
	USING ST_GeomFromText(rd_geometrie_bomen);
	
SELECT COUNT(A.*)
FROM main.bomen  A
JOIN main.adressen B ON ST_Distance(A.rd_geometrie_bomen, B.geometrie) < 1800
WHERE B.identificatie = '0363010000543300'

SELECT COUNT(DISTINCT (A.soortnaam))
FROM main.bomen  A
JOIN main.adressen B ON ST_Distance(A.rd_geometrie_bomen, B.geometrie) < 100
WHERE B.identificatie = '0363010000543300'


select * from main.adressen where identificatie = '0363010000543300'

SELECT COUNT(DISTINCT (A.soortnaam))
FROM main.bomen A


SELECT COUNT(A.*)
FROM main.bomen  A