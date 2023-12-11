import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AutorizationGuard {
  constructor(private dataStorageService : TokenStorageService, private router : Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = this.dataStorageService.getRole();
    console.log("role "+role);
      if(role.includes("ADMIN")){
      return true;
    }
    else{
      this.router.navigateByUrl('/auth/access');
      return false;
    }
  }
  
}
