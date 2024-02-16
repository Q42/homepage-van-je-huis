mkdir data_input
CURL ftp://ftp.data.am­ster­dam.nl/BAG/CSV_Actueel/BAG_verblijfsobject_Actueel.csv  -o ./data_input/BAG_verblijfsobject_Actueel.csv
CURL ftp://ftp.data.am­ster­dam.nl/BAG/CSV_Actueel/BAG_openbare_ruimte_beschrijving_Actueel.csv  -o ./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv
CURL ftp://ftp.data.am­ster­dam.nl/Gebieden/CSV_Actueel/GBD_buurt_Actueel.csv  -o ./data_input/GBD_buurt_Actueel.csv
CURL "https://maps.amsterdam.nl/open_geodata/excel.php?KAARTLAAG=CULTUURVOORZIENINGEN&THEMA=kunstencultuur" -o ./data_input/CULTUURVOORZIENINGEN.csv
CURL "https://maps.amsterdam.nl/open_geodata/excel.php?KAARTLAAG=BOMEN&THEMA=bomen" -o ./data_input/BOMEN.csv
CURL "https://maps.amsterdam.nl/open_geodata/excel.php?KAARTLAAG=BIJEN_HONING&THEMA=honingbijen" -o ./data_input/BIJEN_HONING.csv
