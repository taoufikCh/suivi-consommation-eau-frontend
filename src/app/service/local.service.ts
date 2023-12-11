
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Local } from '../models/local';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { TokenStorageService } from './token-storage.service';

let API_URL = "http://localhost:8222/api/v1/local";
let API_URL2 ="/api/v1/local";

@Injectable({providedIn: 'root'})
export class LocalService {


  getConsommationsStatisticLocal(id:any):Observable<any>{
      console.log(id);
      return this.http.post<any>("http://localhost:8222/api/v1/statistique/statistiqueByLocal", id);
  }
    
  private headers: HttpHeaders = new HttpHeaders();
    constructor(private http: HttpClient, private tokenService : TokenStorageService) { }


   /* public findAll():Observable<Array<Local>>{
      console.log("findall");
      let locaux = this.http.get<Array<Local>>(API_URL);
      console.log(locaux);
    return locaux;
  }*/
  findAll():Observable<Array<Local>>{
    return this.http.get<Array<Local>>(API_URL);
  }

        
  public save(local : Local):Observable<Local>{
        console.log(local);
            return this.http.post(API_URL,local);
      }

      savePhoto(formData:any, id:number){
        return this.http.post(API_URL+'/upload',{formData,id});
      }
  public update(id: any, local: Local):Observable<Local>{
        return this.http.put<Local>(environment.backendHost+API_URL2+"/"+id,local);
    }

    public create(data: any): Observable<any> {
      console.log(data);
          return this.http.post(`${API_URL}`, data);
    }
   
    deleteLocal(id: any)  {
      //const url = `http://localhost:8222/api/v1/local/${id}`;
      return this.http.delete(environment.backendHost+API_URL2+"/"+id, { responseType: 'text' });
    }
    /*public delete(id: any){
      return this.http.delete(environment.backendHost+API_URL2+"/"+id);
    }*/
    public deleteSelectedRows(selectedRows: Local[]){
      // Send a request to delete the selected rows
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

    public getLocalsByFilters(filters:any):Observable<Array<Local>>{
      // Send a request to delete the selected rows
      return this.http.post<Array<Local>>(environment.backendHost+API_URL2+"/filter", filters);
    }
    
    
    exportLocauxToPDF(token: any): Observable<HttpResponse<Blob>> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept':'application/pdf'
      });
      console.log(headers);
    
      return this.http.get<Blob>(
        environment.backendHost+API_URL2+'/local-report',
        {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        }
      );
    }

    getLocalById(id : any):Observable<Local>{
      return this.http.get<Local>(API_URL+"/"+id);
    }


  DownloadFile() : Observable<HttpResponse<Blob>>{
      this.setHeaders();
      //console.log("this header "+this.headers);
      return this.http.get<Blob>(
        environment.backendHost+API_URL2+'/local-report',{
          headers: this.headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        });
  }

  private setHeaders() {
      this.headers = new HttpHeaders();
      this.headers = this.headers.set('Content-Type', 'application/json');
      this.headers = this.headers.set('Accept', 'application/pdf');

      const token = this.tokenService.getToken();
      if (token !== '') {
          const tokenValue = 'Bearer ' + token;
          this.headers = this.headers.set('Authorization', tokenValue);
      }
  }
}