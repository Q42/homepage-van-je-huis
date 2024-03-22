load spatial;

install spatial;

-- secondary enhancement query
SELECT
    DISTINCT (B.*),
    round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
FROM
    main.adressen A
    JOIN main.archief_afbeeldingen AS B ON B.streetId = A."ligtAan:BAG.ORE.identificatieHoofdadres"
WHERE
    (
        A.identificatie = '0363010000682573'
        AND B.wktPoint IS NOT NULL
    )
ORDER BY
    distance_from_address ASC;

-- tertiary enhancement query
SELECT
    DISTINCT (B.*),
    round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
FROM
    main.adressen A
    JOIN main.archief_afbeeldingen AS B ON B.streetId = A."ligtAan:BAG.ORE.identificatieHoofdadres"
WHERE
    (A.identificatie = '0363010000682573');

-- quateniary enhancement query
SELECT
    DISTINCT (B.*),
    round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
FROM
    main.adressen A
    JOIN main.archief_afbeeldingen AS B ON B.title like concat(
        '%',
        A."ligtAan:BAG.ORE.naamHoofdadres",
        '%',
        A.huisnummerHoofdadres,
        '%'
    )
WHERE
    (A.identificatie = '0363010000682573');

-- this is query No.5
SELECT
    DISTINCT (B.*),
    round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
FROM
    main.adressen A
    JOIN main.archief_afbeeldingen AS B ON B.title like concat('%', A."ligtAan:BAG.ORE.naamHoofdadres", '%')
WHERE
    (A.identificatie = '0363010000682573');