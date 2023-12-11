import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { TokenStorageService } from '../service/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{
 
    items!: MenuItem[];

    ngOnInit() {
        this.items = [
           
            { label: 'Paramètre', icon: 'pi pi-cog', url: '' },
            { separator: true },
            { label: 'Deconnexion', icon: 'pi pi-sign-out',command: () => this.logout() }
        ];
    }

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private authService : AuthService, public dataStorage : TokenStorageService) { }
    logout(){
        console.log("log out token "+this.dataStorage.getToken());
        this.authService.logout(this.dataStorage.getToken());
    }
    profile(){}
}
