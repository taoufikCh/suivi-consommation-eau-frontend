import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bordereau } from '../models/bordereau';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


let API_URL = "http://localhost:8222/api/v1/bordereau";
let API_URL2 ="/api/v1/bordereau";

@Injectable({providedIn: 'root'})
export class BordereauService {
    

    constructor(private http: HttpClient) { }

 
findAll():Observable<Array<Bordereau>>{
    return this.http.get<Array<Bordereau>>(API_URL);
  }

    public update(data: Bordereau):Observable<Bordereau>{
      
        return this.http.put<Bordereau>(environment.backendHost+API_URL2,data);
      }

    public create(data: any): Observable<any> {
          return this.http.post(`${API_URL}`, data);
    }

  
    /*public delete(id: any){
      return this.http.delete(environment.backendHost+API_URL2+"/"+id);
    }*/
    delete(id: any)  {
      
      return this.http.delete(environment.backendHost+API_URL2+"/"+id, { responseType: 'text' });
    }
    public deleteSelectedRows(selectedRows: Bordereau[]){
      // Send a request to delete the selected rows
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

}

