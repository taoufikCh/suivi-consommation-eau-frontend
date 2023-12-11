
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeLocal } from '../models/typeLocal';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


let API_URL = "http://localhost:8222/api/v1/typeLocal";
let API_URL2 ="/api/v1/typeLocal";

@Injectable({providedIn: 'root'})
export class TypeLocalService {
    

    constructor(private http: HttpClient) { }

 
findAll():Observable<Array<TypeLocal>>{
    return this.http.get<Array<TypeLocal>>(API_URL);
  }

    public update(data: TypeLocal):Observable<TypeLocal>{
      
        return this.http.put<TypeLocal>(environment.backendHost+API_URL2,data);
      }

    public create(data: any): Observable<any> {
          return this.http.post(`${API_URL}`, data);
    }

  
    public delete(id: any){
      return this.http.delete(environment.backendHost+API_URL2+"/"+id);
    }
    public deleteSelectedRows(selectedRows: TypeLocal[]){
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

}
