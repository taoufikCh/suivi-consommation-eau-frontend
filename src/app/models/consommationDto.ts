
export interface ConsommationDto {
    id?: number;
    refFacture?: string;
    quantite?: Float64Array;
    ancienIndex?: Float64Array;
    nouveauIndex?: Float64Array;
    dateDebut?: string;
    dateFin?: string;
    compteur?: String;
    etatFacture?: String;
    montant?: Float64Array;
    bordereau?: String;
}

