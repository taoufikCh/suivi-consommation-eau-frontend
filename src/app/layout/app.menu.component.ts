import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [
                    { label: 'Tableau de Bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            
            {
                label: 'Utilitaires',
                items: [
                    { label: 'Les districts', icon: 'pi pi-fw pi-map', routerLink: ['/districts'] },
                    { label: 'Les régions', icon: 'pi pi-fw pi-sitemap', routerLink: ['/regions'] },
                    { label: 'Les locaux', icon: 'pi pi-fw pi-building', routerLink: ['/locaux'] },
                ]
            },
            {
                label: 'Consommation d\'eau',
                items: [
                    { label: 'Les compteurs', icon: 'pi pi-fw pi-compass', routerLink: ['/compteurs'] },
                    { label: 'Les consommations', icon: 'pi pi-fw pi-calculator', routerLink: ['/consommations'] },
                    { label: 'Les bordereaux', icon: 'pi pi-fw pi-book', routerLink: ['/bordereaux'] },
                ]
            },
            {
                label: 'Statistique',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    { label: 'Suivi statistique', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/statistique'] },
                ]
            },
            {
                label: 'Paramètres',
                items: [
                    { label: 'Les natures d\'exercices', icon: 'pi pi-fw pi-building', routerLink: ['/natureExercices'] },
                    { label: 'Les types locaux', icon: 'pi pi-fw pi-building', routerLink: ['/typesLocaux'] },
                ]
            },
           
            
            
        ];
    }
}
