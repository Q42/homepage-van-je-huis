INSTALL spatial;
LOAD spatial;



SELECT A.id, A.naam , round(ST_Distance(A.geometrie, B.geometrie),0) as distance_from_address
FROM main.buitenkunst  A
JOIN main.adressen B ON ST_Distance(A.geometrie, B.geometrie) < 10000
WHERE B.identificatie = '0363010000543292'
ORDER BY distance_from_address ASC;
