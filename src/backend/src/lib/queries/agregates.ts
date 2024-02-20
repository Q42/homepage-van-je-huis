export const aggregateQueries = {
    sqlCreateAggregateTable: ({
        aggregateTableName,
        buurtenTableName,
        beesTableName,
        treesTableName
    }: {
        aggregateTableName: string;
        buurtenTableName: string;
        beesTableName: string;
        treesTableName: string;
    }) => `
    CREATE TABLE ${aggregateTableName} AS
    SELECT
        A.*,
        B.number_of_bees,
        C.number_of_trees,
        C.number_of_tree_species
    FROM
        ${buurtenTableName} A
        LEFT JOIN (
            SELECT
            ${buurtenTableName}.code,
                SUM(${beesTableName}.aantal_volken) as 'number_of_bees',
            FROM
                ${buurtenTableName}
                JOIN ${beesTableName} ON ST_Within(${beesTableName}.rd_geometrie_bijen, ${buurtenTableName}.geometrie)
            GROUP BY
            ${buurtenTableName}.*
        ) AS B ON A.code = B.code
        LEFT JOIN(
            SELECT
                ${buurtenTableName}.code,
                COUNT(${treesTableName}.soortnaam) AS 'number_of_trees',
                COUNT(DISTINCT(${treesTableName}.soortnaam)) AS 'number_of_tree_species'
            FROM
                ${buurtenTableName}
                JOIN ${treesTableName} ON ST_Within(${treesTableName}.rd_geometrie_bomen, ${buurtenTableName}.geometrie)
            GROUP BY
                ${buurtenTableName}.*
        ) AS C ON A.code = C.code;
    `,
    sqlGetNumberOfTreeSpecies: ({ aggregateTableName, brtCode }: { aggregateTableName: string; brtCode: string }) => `
    Select number_of_tree_species as treeSpecies from ${aggregateTableName}
    where "code" = '${brtCode}'`,
    sqlGetNumberOfTrees: ({ aggregateTableName, wijkCode }: { aggregateTableName: string; wijkCode: string }) => `
    Select SUM(number_of_trees) as trees from ${aggregateTableName}
    where "ligtIn:GBD.WIJK.code" = '${wijkCode}';
    `,
    sqlGetNumberOfBees: ({ aggregateTableName, sdlCode }: { aggregateTableName: string; sdlCode: string }) => `
    Select SUM(number_of_bees) as bees from ${aggregateTableName}
    where "ligtIn:GBD.SDL.code" = '${sdlCode}'
    `
};
