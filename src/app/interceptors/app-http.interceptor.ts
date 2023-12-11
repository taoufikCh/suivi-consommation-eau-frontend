import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { TokenStorageService } from '../service/token-storage.service';
import { AuthService } from '../service/auth.service';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenStorageService, private authService : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();
    console.log(request.url);
    
    if(!request.url.includes("login") && token != null && !request.url.includes("refresh-token")){
      
     
      /*let newRequest = request.clone({ 
        headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
        return next.handle(newRequest).pipe(*/
        let newRequest = this.AddTokenheader(request, this.tokenService.getToken());
        console.log(newRequest);
        return next.handle(newRequest).pipe(
          catchError(er =>{
            console.log(er.status);
            if(er.status=== 401){
              // refresh token logic
              return this.handleRefrehToken(request, next);
            }
            return throwError(er);
          })
        );
    }
    else return next.handle(request);
    
    
  }

  handleRefrehToken(request: HttpRequest<any>, next: HttpHandler) {
    const RefresTtoken = this.tokenService.getRefreshToken();
    console.log("refresh token ="+RefresTtoken);
    if(RefresTtoken!=null&& RefresTtoken!=''){
      return this.authService.refreshToken().pipe(
        switchMap((data: any) => {
          console.log("data "+data);
          this.tokenService.saveToken(data);
          return next.handle(this.AddTokenheader(request,this.tokenService.getToken()))
        }),
        catchError(errodata=>{
          console.log(errodata);
          this.authService.logout(this.tokenService.getToken());
          return throwError(errodata)
        })
      );
    }
    else{
      console.log("refresh token is undefined ");
          this.authService.logout(this.tokenService.getToken());
        return throwError("refresh token is undefined")
    }
  }

  AddTokenheader(request: HttpRequest<any>, token: any) {
    console.log("add token header "+token);
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}

