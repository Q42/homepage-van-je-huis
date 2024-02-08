import { ColumnDefenitions } from "../lib/types";

export const straatOmschrijvingInputColumns: ColumnDefenitions = {
    identificatie: "VARCHAR",
    naam: "VARCHAR",
    beschrijving: "VARCHAR"
};

export const straatnaamOmschrijvingOutputColumns: string[] = ["identificatie", "naam", "beschrijving"];
