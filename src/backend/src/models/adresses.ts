import { ColumnDefenitions } from "../lib/types";

export const adresInputColumns: ColumnDefenitions = {
    "identificatie": "VARCHAR",
    "aanduidingInOnderzoek": "VARCHAR",
    "geconstateerd": "VARCHAR",
    "heeftIn:BAG.NAG.identificatieHoofdadres": "VARCHAR",
    "huisnummerHoofdadres": "INTEGER",
    "huisletterHoofdadres": "VARCHAR",
    "huisnummertoevoegingHoofdadres": "VARCHAR",
    "postcodeHoofdadres": "VARCHAR",
    "ligtAan:BAG.ORE.identificatieHoofdadres": "VARCHAR",
    "ligtAan:BAG.ORE.naamHoofdadres": "VARCHAR",
    "ligtIn:BAG.WPS.identificatieHoofdadres": "VARCHAR",
    "ligtIn:BAG.WPS.naamHoofdadres": "VARCHAR",
    "ligtIn:BRK.GME.identificatie": "VARCHAR",
    "ligtIn:BRK.GME.naam": "VARCHAR",
    "heeftIn:BAG.NAG.identificatieNevenadres": "VARCHAR",
    "gebruiksdoel": "VARCHAR",
    "gebruiksdoelWoonfunctie": "VARCHAR",
    "gebruiksdoelGezondheidszorgfunctie": "VARCHAR",
    "aantalEenhedenComplex": "INTEGER",
    "is:WOZ.WOB.soortObject": "VARCHAR",
    "oppervlakte": "VARCHAR",
    "status": "VARCHAR",
    "beginGeldigheid": "VARCHAR",
    "eindGeldigheid": "VARCHAR",
    "documentdatum": "VARCHAR",
    "documentnummer": "VARCHAR",
    "verdiepingToegang": "VARCHAR",
    "toegang": "VARCHAR",
    "aantalBouwlagen": "INTEGER",
    "hoogsteBouwlaag": "INTEGER",
    "laagsteBouwlaag": "INTEGER",
    "aantalKamers": "INTEGER",
    "eigendomsverhouding": "VARCHAR",
    "redenopvoer": "VARCHAR",
    "redenafvoer": "VARCHAR",
    "ligtIn:BAG.PND.identificatie": "VARCHAR",
    "ligtIn:GBD.BBK.identificatie": "VARCHAR",
    "ligtIn:GBD.BBK.code": "VARCHAR",
    "ligtIn:GBD.BRT.identificatie": "VARCHAR",
    "ligtIn:GBD.BRT.code": "VARCHAR",
    "ligtIn:GBD.BRT.naam": "VARCHAR",
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
    "geometrie": "GEOMETRY"
};

export type DBAddress = {
    "identificatie": string;
    "ligtIn:BAG.PND.identificatie": string;
    "huisnummerHoofdadres": number;
    "huisletterHoofdadres": string | undefined;
    "huisnummertoevoegingHoofdadres": string | undefined;
    "postcodeHoofdadres": string;
    "ligtAan:BAG.ORE.identificatieHoofdadres": string;
    "ligtAan:BAG.ORE.naamHoofdadres": string;
    "gebruiksdoel": string | undefined;
    "ligtIn:GBD.BRT.code": string;
    "ligtIn:GBD.WIJK.code": string;
    "ligtIn:GBD.GGW.code": string;
    "ligtIn:GBD.SDL.code": string;
    "geometrie": string;
};

export const adresOutputColumns: string[] = [
    "identificatie",
    "huisnummerHoofdadres",
    "huisletterHoofdadres",
    "huisnummertoevoegingHoofdadres",
    "postcodeHoofdadres",
    "ligtAan:BAG.ORE.identificatieHoofdadres",
    "ligtAan:BAG.ORE.naamHoofdadres",
    "ligtIn:BAG.PND.identificatie",
    "gebruiksdoel",
    "ligtIn:GBD.BRT.code",
    "ligtIn:GBD.WIJK.code",
    "ligtIn:GBD.GGW.code",
    "ligtIn:GBD.SDL.code",
    "geometrie"
];
