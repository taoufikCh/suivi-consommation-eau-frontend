import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthService} from '../../../service/auth.service';
import { TokenStorageService } from '../../../service/token-storage.service';
import { Login } from 'src/app/models/login';
import { CommonModule } from '@angular/common';
import { Message,MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})

export class LoginComponent implements OnInit{

    userData : Login  = {
      email:'',
      password : ''
    };
    submitted: boolean = false;
    errorMessage = '';
    roles: string[] = [];
    testtt :"taoufik";

    constructor(
      public layoutService: LayoutService,
      private tokenStorage: TokenStorageService,
      private authService: AuthService,
      private router: Router,
      private messageService: MessageService,
    ) {}
      ngOnInit() {
         console.log('login page');
        }
      handleLogin() {
        this.submitted = true;
        this.authService.login(this.userData).subscribe(
            (response) => {
                //console.log(response);
                //this.authService.loadProfile(response)
                this.tokenStorage.saveToken(response);
               // this.tokenStorage.loadProfile(response.access_token);
                //this.isLoggedIn = true;
               // this.roles = this.tokenStorage.getUser().roles;
                this.router.navigate(['/']);
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Email et/ou mot de passe incorrect(s)', life: 5000 });
            //console.error('Login failed:', error.message);
          }
        );
        //console.log(this.userData);
      }
}


