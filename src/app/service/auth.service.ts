import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';



let AUTH_API ="/api/v1/auth";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private header: HttpHeaders = new HttpHeaders();

  isAuthenticated : boolean = false ;


  constructor(private http: HttpClient, private tokenService: TokenStorageService, private router : Router) { }

  login(credentials): Observable<any> {
    //return this.http.put<School>(environment.backendHost+API_URL2+"/"+id,school);
    return this.http.post<any>(environment.backendHost+AUTH_API+"/authenticate", {
      email: credentials.email,
      password: credentials.password
    }, httpOptions);

  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      password: user.password
    }, httpOptions);
  }

  logout(token: string){
    this.header = new HttpHeaders();
     if (token !== '') {
      const tokenValue = 'Bearer ' + token;
      this.header = this.header.set('Authorization', tokenValue);
  }
      
      console.log("log out page");
      console.log(this.header);
      //console.log(this.http.post<void>(environment.backendHost+'/logout', null, { headers }));
       this.http.get<any>(environment.backendHost+'/api/v1/auth/logout', {
        headers: this.header }
        ).subscribe(
          (data) => {
            console.log("data "+data);
            //return true;
            // Handle successful logout (e.g., clear user data and navigate to the login page)
            this.tokenService.removeDataStorage();
            this.router.navigateByUrl('/login'); 
          },
          (error) => {
            // Handle error (e.g., display an error message)
            console.log("error "+error);
            return false;
          }
        
        );
       //return "false";
      //
      //console.log("log out page");
      //this.router.navigateByUrl('/login'); 
  }

  checkTokenRevocation(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.backendHost+AUTH_API}/check-token?token=${token}`);
  }
  refreshToken(){
    const refreshToken = this.tokenService.getRefreshToken();
    console.log("refresh token : "+refreshToken);
    this.header = new HttpHeaders();
     if (refreshToken != '') {
      const tokenValue = 'Bearer ' + refreshToken;
      this.header = this.header.set('Authorization', tokenValue);
  }
    //return this.http.post(`${environment.backendHost+AUTH_API}/refresh-token`,null ,{this.header});
    return this.http.post(`${environment.backendHost+AUTH_API}/refresh-token`, {}, {headers: this.header});
  }
  


  
}