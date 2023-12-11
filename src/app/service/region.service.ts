import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from '../models/region';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { District } from '../models/districts';

let API_URL = "http://localhost:8222/api/v1/region";

@Injectable({
  providedIn: 'root'
})
export class RegionService {

    constructor(private http: HttpClient) { }


findAll():Observable<Array<Region>>{
  return this.http.get<Array<Region>>(API_URL);
}
  getRegions() {
      return this.http.get<any>(API_URL)
          .toPromise()
          .then(res => res as Region[])
          .then(data => data);
  }
  

  public createRegion(data: any): Observable<any> {
    return this.http.post(`${API_URL}`, data);
}

getRegionByDistrict(district : District):Observable<Array<Region>>{
  return this.http.get<Array<Region>>(API_URL+"/district/"+district.id);
}
getRegionById(id : any):Observable<Region>{
  return this.http.get<Region>(API_URL+"/"+id);
}
}
