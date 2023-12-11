import { NatureExercise } from "./natureExercice";
import { Region } from "./region";
import { TypeLocal } from "./typeLocal";
import { LocalStatus } from "./localStatus";

export interface Local {
    id?: string;
    code?: string;
    designation?: string;
    image?: string;
    adresse?: string;
    longitude?: string;
    latitude?: string;
    region?: Region;
    type_local?: TypeLocal;
    nature_exercise?: NatureExercise;
    etat?: number;
}

