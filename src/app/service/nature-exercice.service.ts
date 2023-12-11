import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NatureExercise } from '../models/natureExercice';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


let API_URL = "http://localhost:8222/api/v1/natureExercise";
let API_URL2 ="/api/v1/natureExercise";

@Injectable({providedIn: 'root'})
export class NatureExerciceService {
    

    constructor(private http: HttpClient) { }

 
findAll():Observable<Array<NatureExercise>>{
    return this.http.get<Array<NatureExercise>>(API_URL);
  }

    public update(data: NatureExercise):Observable<NatureExercise>{
      
        return this.http.put<NatureExercise>(environment.backendHost+API_URL2,data);
      }

    public create(data: any): Observable<any> {
          return this.http.post(`${API_URL}`, data);
    }

  
    public delete(id: any){
      return this.http.delete(environment.backendHost+API_URL2+"/"+id);
    }
    public deleteSelectedRows(selectedRows: NatureExercise[]){
      // Send a request to delete the selected rows
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

 




}
