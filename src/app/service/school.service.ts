import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { School } from '../models/schools';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { TokenStorageService } from './token-storage.service';

let API_URL = "http://localhost:8222/api/v1/schools";
let API_URL2 ="/api/v1/schools";

@Injectable({providedIn: 'root'})
export class SchoolService {
    
  private headers: HttpHeaders = new HttpHeaders();
    constructor(private http: HttpClient, private tokenService : TokenStorageService) { }

   /* findAllSchools(): Observable<any> {
        return this.http.get(API_URL,{headers: {"Content-Type":"application/json; charset=UTF-8"}});
      }
*/
//Cette methode permet de retourner la liste des categories
findAll():Observable<Array<School>>{
    return this.http.get<Array<School>>(API_URL);
  }
    getSchools() {
        return this.http.get<any>(API_URL)
            .toPromise()
            .then(res => res as School[])
            .then(data => data);
    }

   /* getSchools() {
        return this.http.get<any>('assets/demo/data/schools.json')
            .toPromise()
            .then(res => res.data as School[])
            .then(data => data);
    }*/
    
        
    public save(school : School):Observable<School>{
        console.log(school);
        //console.log(this.http.post(API_URL,school));
            return this.http.post(API_URL,school);
      }
    public update(id: number, school: School):Observable<School>{
        return this.http.put<School>(environment.backendHost+API_URL2+"/"+id,school);
      }

    public createSchool(schoolData: any): Observable<any> {
          return this.http.post(`${API_URL}`, schoolData);
    }

    /*public deleteSchool(schoolData: any): Observable<any> {
      return this.http.post(`${API_URL}`, schoolData);
    }
    public delete(id: number){
      return this.http.delete(this.api+""+id);
    }*/
    public delete(id: any){
      return this.http.delete(environment.backendHost+API_URL2+"/"+id);
    }
    public deleteSelectedRows(selectedRows: School[]){
      // Send a request to delete the selected rows
      return this.http.post(environment.backendHost+API_URL2+"/delete-rows", selectedRows);
    }

    /*exportSchoolsToPDF(): Observable<HttpResponse<Blob>> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      return this.http.post<Blob>(
        environment.backendHost+API_URL2+'/school-report',
        null,
        {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        }
      );
    }*/
    exportSchoolsToPDF(token: any): Observable<HttpResponse<Blob>> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept':'application/pdf'
      });
      console.log(headers);
    
      return this.http.get<Blob>(
        environment.backendHost+API_URL2+'/school-report',
        {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response'
        }
      );
    }
/*
    public saveBook(token: string) {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
     var mediaType = 'application/pdf';
 
     this.http.post(environment.backendHost+API_URL2+'/school-report', { headers, responseType:'blob' }).subscribe(
         (response) => {
             var blob = new Blob([response], { type: mediaType });
             
         });
 }
    */


  DownloadFile() : Observable<HttpResponse<Blob>>{
      this.setHeaders();
      //console.log("this header "+this.headers);
      return this.http.get<Blob>(
        environment.backendHost+API_URL2+'/school-report',{
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