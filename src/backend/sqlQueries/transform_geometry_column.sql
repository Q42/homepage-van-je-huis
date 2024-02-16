alter table tableName alter columnName set
data type GEOMETRY
	USING ST_GeomFromText(columnName)