INSTALL spatial; LOAD spatial;

create table adressen as SELECT * from "/Users/thomas/Projects/homepage-van-je-huis/src/backend/intermediate_output/adressen.parquet";
create table buitenkunst as SELECT * from "/Users/thomas/Projects/homepage-van-je-huis/src/backend/crawler_output/buitenkunst.parquet";

describe buitenkunst;
describe adressen;

alter table buitenkunst alter location set
data type GEOMETRY
	USING ST_GeomFromText(location);
	
alter table adressen alter geometrie set
data type GEOMETRY
	USING ST_GeomFromText(geometrie);
	
describe buitenkunst;
describe adressen;


SELECT A.title , A.image , A.visitUrl , round(ST_Distance(A.location, B.geometrie),0) as distance_from_address
FROM main.buitenkunst  A
JOIN main.adressen B ON ST_Distance(A.location, B.geometrie) < 2000
WHERE B.identificatie = '0363010000543300'
ORDER BY distance_from_address ASC;