import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private auth: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
   /* if (this.router.url === '/auth/login') {
      // Allow access to the login page
      return true;
    }*/
    console.log("is logged in : "+this.auth.isLoggedIn());
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      //this.router.navigateByUrl('/login');
      return false;
    }
  }
  
}
