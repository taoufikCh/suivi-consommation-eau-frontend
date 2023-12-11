import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TokenStorageService } from './service/token-storage.service';
import { AuthGuard } from './guard/auth.guard';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, 
        //private AuthGuard : AuthGuard,
        // private service : TokenStorageService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        //this.isValidToken();
    }
    
}
