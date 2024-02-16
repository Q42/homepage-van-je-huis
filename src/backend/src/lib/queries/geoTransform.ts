/**
 * Transforms the geometry column of a table in the database.
 * Adds a new geometry column and updates it with transformed geometry values.
 *
 * @param {string} tableName - The name of the table.
 * @param {string} sourceColumnName - The name of the source geometry column. IMPORTANT: This must be a geometry text (VARCHAR) column, not a geometry column.
 * @param {string} [targetColumnName] - The name of the new geometry column.
 * @param {string} sourceEpsg - The EPSG code of the source coordinate system.
 * @param {string} targetEpsg - The EPSG code of the target coordinate system.
 * @returns {string} The SQL query for adding a new column in the targed coordinate system.
 */
export const sqlTransformGeometry = ({
    tableName,
    targetColumnName,
    sourceColumnName,
    sourceEpsg,
    targetEpsg
}: {
    tableName: string;
    sourceColumnName: string;
    targetColumnName?: string;
    sourceEpsg: string;
    targetEpsg: string;
}) => {
    if (targetColumnName === undefined) {
        targetColumnName = sourceColumnName;
    }

    return `
${sourceColumnName !== targetColumnName ? "ALTER TABLE ${tableName} ADD COLUMN ${targetColumnName} GEOMETRY;" : ""}    
UPDATE ${tableName} 
SET ${targetColumnName} = ST_Transform(${sourceColumnName}, '${sourceEpsg}', '${targetEpsg}');
`;
};
