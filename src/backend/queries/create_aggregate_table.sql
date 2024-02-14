INSTALL spatial;

LOAD spatial;

create table aggregates as
select
    buurten.*,
    COUNT(bomen.soortnaam) as 'number_of_trees',
    COUNT(DISTINCT(bomen.soortnaam)) as 'number_of_tree_species'
FROM
    main.buurten
    JOIN main.bomen ON ST_Within(bomen.rd_geometrie_bomen, buurten.geometrie)
GROUP BY
    buurten.*