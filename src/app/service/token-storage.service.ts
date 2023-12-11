import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'access_token';
const TOKEN_REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  isAuthenticated : boolean = false;
  role : any;
  username : any;
  name : any;
  constructor() { }
  decodeJwt : any ;

  public saveToken(data: any) {
   console.log(data);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.removeItem(TOKEN_REFRESH_KEY);
    localStorage.setItem(TOKEN_REFRESH_KEY, data.refresh_token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  public getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_REFRESH_KEY);
  }
  public getName (): string | null{
    this.decodeJwt = jwtDecode(this.getToken());
    return this.name = this.decodeJwt.name;
   
  }
  public getRole (): string | null{
    this.decodeJwt = jwtDecode(this.getToken());
    return this.role = this.decodeJwt.role;
  }

  public getDateExpiration (): string | null{
    this.decodeJwt = jwtDecode(this.getToken());
    return this.role = this.decodeJwt.exp;
  }

  
  
 /* loadProfile(response: any) {
    //this.isAuthenticated = true;
    //let token = this.getToken();
    let decodeJwt : any = jwtDecode(response);
    this.username = decodeJwt.sub;
    this.name = decodeJwt.name;
    this.role = decodeJwt.role;
    console.log("name : "+this.name);
    console.log("role : "+this.role);
  }
*/
  
checkTokenExpiration(token: string): boolean {
  try {
    this.decodeJwt  = jwtDecode(token);
    const expirationDate = new Date(this.decodeJwt.exp * 1000); // Convert to milliseconds
    const currentDate = new Date();
    
    // Check if the token has expired
    return expirationDate < currentDate;
  } catch (error) {
    // Token decoding or other error occurred
    return true; // Consider it as expired or handle the error accordingly
  }
}

  isLoggedIn(): boolean {
    
    const token = this.getToken();
    
    return !!token; // Double negation to convert null/undefined to false
  }

  removeDataStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_REFRESH_KEY);
    //localStorage.setItem(TOKEN_KEY, null);
    //localStorage.setItem(TOKEN_REFRESH_KEY, null);
    this.isLoggedIn();
    this.name=undefined;
    this.role=undefined;
    /*console.log("name = "+this.name);
    console.log(" this.isLoggedIn(); = "+ this.isLoggedIn());
    console.log("role = "+this.role);
    */
    //this.username=undefined;
  }
}