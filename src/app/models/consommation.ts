import { Bordereau } from "./bordereau";


export interface Consommation {
    id?: number;
    refFacture?: string;
    quantite?: Float64Array;
    ancienIndex?: Float64Array;
    nouveauIndex?: Float64Array;
    dateDebut?: string;
    dateFin?: string;
    periode?: string;
    compteurId?: number;
    etatFacture?: boolean;
    montant?: Float64Array;
    bordereau?: Bordereau;
}

