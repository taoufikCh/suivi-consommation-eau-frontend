import { District } from "./districts";

export interface Region {
    id?: string;
    code?: string;
    libille?: string;
    district?: District;

}