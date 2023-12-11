import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '../models/districts';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { TokenStorageService } from './token-storage.service';

let API_URL = "http://localhost:8222/api/v1/district";
let API_URL2 ="/api/v1/district";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

    constructor(private http: HttpClient, private tokenService : TokenStorageService) { }


findAll():Observable<Array<District>>{
  return this.http.get<Array<District>>(API_URL);
}
  getDistricts() {
      return this.http.get<any>(API_URL)
          .toPromise()
          .then(res => res as District[])
          .then(data => data);
  }
  

  public createDistrict(data: any): Observable<any> {
    return this.http.post(`${API_URL}`, data);
}

getDistrictById(id : any):Observable<District>{
  return this.http.get<District>(API_URL+"/"+id);
}

}