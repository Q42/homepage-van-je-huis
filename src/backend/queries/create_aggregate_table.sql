CREATE TABLE aggregates AS
SELECT
    A.*,
    B.number_of_bees,
    C.number_of_trees,
    C.number_of_tree_species
FROM
    main.buurten A
    LEFT JOIN (
        SELECT
            buurten.code,
            SUM(bijen.aantal_volken) as 'number_of_bees',
        FROM
            main.buurten
            JOIN main.bijen ON ST_Within(bijen.rd_geometrie_bijen, buurten.geometrie)
        GROUP BY
            buurten.*
    ) AS B ON A.code = B.code
    LEFT JOIN(
        SELECT
            buurten.code,
            COUNT(bomen.soortnaam) AS 'number_of_trees',
            COUNT(DISTINCT(bomen.soortnaam)) AS 'number_of_tree_species'
        FROM
            main.buurten
            JOIN main.bomen ON ST_Within(bomen.rd_geometrie_bomen, buurten.geometrie)
        GROUP BY
            buurten.*
    ) AS C ON A.code = C.code;