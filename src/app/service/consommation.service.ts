import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consommation } from '../models/consommation';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { TokenStorageService } from './token-storage.service';

let API_URL = "http://localhost:8222/api/v1/consommation";
let API_URL2 ="/api/v1/consommation";

@Injectable({providedIn: 'root'})
export class ConsommationService {


 

  
  
    
  private headers: HttpHeaders = new HttpHeaders();
    constructor(private http: HttpClient, private tokenService : TokenStorageService) { }


    public findAll():Observable<Array<Consommation>>{
    return this.http.get<Array<Consommation>>(API_URL);
  }

        
  public save(consommation : Consommation):Observable<Consommation>{
        console.log(consommation);
            return this.http.post(API_URL,consommation);
      }
  public update(id: any, Consommation: Consommation):Observable<Consommation>{
        return this.http.put<Consommation>(environment.backendHost+API_URL2+"/"+id,Consommation);
    }

    public create(data: any): Observable<any> {
      console.log(data);
          return this.http.post(`${API_URL}`, data);
    }
   
    delete(id: any)  {
      return this.http.delete(environment.backendHost+API_URL2+"/"+id, { responseType: 'text' });
    }
    
    public deleteSelectedRows(selectedRows: Consommation[]){
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

    
   /* exportLocauxToPDF(token: any): Observable<HttpResponse<Blob>> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept':'application/pdf'
      });
      console.log(headers);
    
      return this.http.get<Blob>(
        environment.backendHost+API_URL2+'/consommation-report',
        {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        }
      );
    }*/
    
    public getConsommationsByFilters(filters:any):Observable<Array<Consommation>>{
      console.log(filters);

      return this.http.post<Array<Consommation>>("http://localhost:8021/api/v1/consommation/filter", filters);
    }

    public getConsommationsStatistic(filters:any):Observable<any>{
      console.log(filters);
      

      return this.http.post<any>("http://localhost:8222/api/v1/statistique/statistiqueConsommation", filters);
    }
    public getConsommationsStatisticOfTypeAndNature(filters:any):Observable<any>{
      console.log(filters);
      
  
      return this.http.post<any>("http://localhost:8222/api/v1/statistique/statistiqueTypeLocal", filters);
    }

  DownloadFile2(filterparams : any, consommations:any) : Observable<HttpResponse<Blob>>{
    let f = {};
    console.log(filterparams);
    let filter = JSON.stringify(f);
    //let consommation = JSON.stringify(filterparams);
    const queryParams = new URLSearchParams();
    queryParams.set('f', filter);
    queryParams.set('filterparams', JSON.stringify(filterparams));
    queryParams.set('consommations', JSON.stringify(consommations));
   
    const urlWithParams = `${environment.backendHost}${API_URL2}/consommation-list-report?
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
    
    const urlWithParams = `${environment.backendHost}${API_URL2}/consommation-list-report`;

    this.setHeaders();

    return this.http.post<Blob>(
      urlWithParams,
      {
        filterparams: JSON.stringify(filterparams),
        consommations: JSON.stringify(consommations)
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