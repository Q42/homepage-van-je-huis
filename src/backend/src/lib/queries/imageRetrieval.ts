export const imageArchive = {
    sqlSelectArchivePhotos: ({ photoTableName, pandId }: { photoTableName: string; pandId: string }) =>
        `SELECT DISTINCT(*) FROM ${photoTableName} WHERE pandId = '${pandId}'`,
    sqlGetNeighboringImages: ({
        addressTableName,
        archiveImagesTableName,
        addressId,
        maxDistance,
        limit
    }: {
        addressTableName: string;
        archiveImagesTableName: string;
        addressId: string;
        maxDistance?: number;
        limit?: number;
    }) => `
    SELECT
        DISTINCT (B.*), round(ST_Distance(A.geometrie , B.wktPoint),0) as distance_from_address
    FROM
        ${addressTableName} A
    JOIN ${archiveImagesTableName} AS B ON
        B.streetId = A."ligtAan:BAG.ORE.identificatieHoofdadres"
    WHERE
        (A.identificatie = '${addressId}' AND B.wktPoint IS NOT NULL ) AND distance_from_address < ${maxDistance}
    ORDER BY distance_from_address ASC ${limit ? `LIMIT ${limit}` : ""};
    `,
    sqlStreetIdSearch: ({
        addressTableName,
        archiveImagesTableName,
        addressId,
        limit
    }: {
        addressTableName: string;
        archiveImagesTableName: string;
        addressId: string;
        limit?: number;
    }) => `
    SELECT
        DISTINCT (B.*),
        round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
    FROM
        ${addressTableName} A
        JOIN ${archiveImagesTableName} AS B ON B.streetId = A."ligtAan:BAG.ORE.identificatieHoofdadres"
    WHERE
        (A.identificatie = '${addressId}')
        ${limit ? `LIMIT ${limit}` : ""};
    `,
    sqlAddressTitleSearch: ({
        addressTableName,
        archiveImagesTableName,
        addressId,
        limit
    }: {
        addressTableName: string;
        archiveImagesTableName: string;
        addressId: string;
        limit?: number;
    }) => `
    SELECT
        DISTINCT (B.*),
        round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
    FROM
        ${addressTableName}  A
        JOIN ${archiveImagesTableName} AS B ON B.title like concat(
            '%',
            A."ligtAan:BAG.ORE.naamHoofdadres",
            '%',
            A.huisnummerHoofdadres,
            '%'
        )
    WHERE
        (A.identificatie = '${addressId}')
        ${limit ? `LIMIT ${limit}` : ""};
        `,
    sqlStreetTitleSearch: ({
        addressTableName,
        archiveImagesTableName,
        addressId,
        limit
    }: {
        addressTableName: string;
        archiveImagesTableName: string;
        addressId: string;
        limit?: number;
    }) => `SELECT
            DISTINCT (B.*),
            round(ST_Distance(A.geometrie, B.wktPoint), 0) as distance_from_address
        FROM
        ${addressTableName} A
            JOIN ${archiveImagesTableName} AS B ON B.title like concat('%', A."ligtAan:BAG.ORE.naamHoofdadres", '%')
        WHERE
            (A.identificatie = '${addressId}')
            ${limit ? `LIMIT ${limit}` : ""};`
};
