
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compteur } from '../models/compteur';
import { Local } from '../models/local';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { TokenStorageService } from './token-storage.service';

let API_URL = "http://localhost:8222/api/v1/compteur";
let API_URL2 ="/api/v1/compteur";

@Injectable({providedIn: 'root'})
export class CompteurService {
    
  private headers: HttpHeaders = new HttpHeaders();
    constructor(private http: HttpClient, private tokenService : TokenStorageService) { }


    public findAll():Observable<Array<Compteur>>{
    return this.http.get<Array<Compteur>>(API_URL);
  }

        
  public save(compteur : Compteur):Observable<Compteur>{
        console.log(compteur);
            return this.http.post(API_URL,compteur);
      }
  public update(id: any, compteur: Compteur):Observable<Compteur>{
        return this.http.put<Compteur>(environment.backendHost+API_URL2+"/"+id,compteur);
    }

    public create(data: any): Observable<any> {
      console.log(data);
          return this.http.post(`${API_URL}`, data);
    }
   
    deleteCompteur(id: any)  {
      return this.http.delete(environment.backendHost+API_URL2+"/"+id, { responseType: 'text' });
    }
    
    public deleteSelectedRows(selectedRows: Compteur[]){
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

    public getCompteursByLocals(data: Local[]):Observable<Array<Compteur>>{
      return this.http.post<Array<Compteur>>(environment.backendHost+API_URL2+"/filter", data);
    }

    
    exportLocauxToPDF(token: any): Observable<HttpResponse<Blob>> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept':'application/pdf'
      });
      console.log(headers);
    
      return this.http.get<Blob>(
        environment.backendHost+API_URL2+'/compteur-report',
        {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        }
      );
    }


  

  DownloadFile2(filterparams : any, consommations:any) : Observable<HttpResponse<Blob>>{
    let f = {};
    console.log(filterparams);
    let filter = JSON.stringify(f);
    //let consommation = JSON.stringify(filterparams);
    const queryParams = new URLSearchParams();
    queryParams.set('f', filter);
    queryParams.set('filterparams', JSON.stringify(filterparams));
    queryParams.set('compteurs', JSON.stringify(consommations));
   
    const urlWithParams = `${environment.backendHost}${API_URL2}/compteur-list-report?
                            ${queryParams.toString()}`;

      this.setHeaders();
      return this.http.get<Blob>(
        urlWithParams,{
          headers: this.headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        });
  }

  DownloadFile(filterparams: any, consommations: any): Observable<HttpResponse<Blob>> {
    console.log(filterparams);
    
    const urlWithParams = `${environment.backendHost}${API_URL2}/compteur-list-report`;

    this.setHeaders();

    return this.http.post<Blob>(
      urlWithParams,
      {
        filterparams: JSON.stringify(filterparams),
        compteurs: JSON.stringify(consommations)
      },
      {
        headers: this.headers,
        responseType: 'blob' as 'json',
        observe: 'response'
      }
    );
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