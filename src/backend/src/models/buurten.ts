import { ColumnDefenitions } from "../lib/types";

export const buurtenInputColumns: ColumnDefenitions = {
    "identificatie": "VARCHAR",
    "code": "VARCHAR",
    "naam": "VARCHAR",
    "beginGeldigheid": "DATE",
    "eindGeldigheid": "DATE",
    "documentdatum": "DATE",
    "documentnummer": "VARCHAR",
    "cbsCode": "VARCHAR",
    "ligtIn:GBD.WIJK.identificatie": "VARCHAR",
    "ligtIn:GBD.WIJK.code": "VARCHAR",
    "ligtIn:GBD.WIJK.naam": "VARCHAR",
    "ligtIn:GBD.GGW.identificatie": "VARCHAR",
    "ligtIn:GBD.GGW.code": "VARCHAR",
    "ligtIn:GBD.GGW.naam": "VARCHAR",
    "ligtIn:GBD.GGP.identificatie": "VARCHAR",
    "ligtIn:GBD.GGP.code": "VARCHAR",
    "ligtIn:GBD.GGP.naam": "VARCHAR",
    "ligtIn:GBD.SDL.identificatie": "VARCHAR",
    "ligtIn:GBD.SDL.code": "VARCHAR",
    "ligtIn:GBD.SDL.naam": "VARCHAR",
    "ligtIn:BRK.GME.identificatie": "VARCHAR",
    "ligtIn:BRK.GME.naam": "VARCHAR",
    "geometrie": "GEOMETRY"
};

export const buurtenOutputColumns: string[] = [...Object.keys(buurtenInputColumns)];
