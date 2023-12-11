import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Compteur } from 'src/app/models/compteur';
import { Local } from 'src/app/models/local';
import { CompteurService } from 'src/app/service/compteur.service';
import { LocalService } from 'src/app/service/local.service';

@Component({
  templateUrl: './counter.component.html',
  providers: [MessageService],

})

export class CounterComponent implements OnInit{
 
  compteur: Compteur = {};
  local: Local = {};
  locaux: Local []= [];
  compteurEdit: Compteur ={};
  submitted: boolean = false;
  editCompteur : boolean = false;
  items: MenuItem[] | undefined;
  minDate: Date | undefined;

    maxDate: Date | undefined;
    etat: boolean = true;
    dateValue: Date;
  home: MenuItem | undefined;
  pageTitle : String= "Formulaire d'ajout d'un compteur ";
  inputStyle = '';

  constructor(private localService: LocalService, private compteurService: CompteurService,
      private messageService: MessageService,
 private router: Router ) {  
  this.compteurEdit =this.router.getCurrentNavigation()?.extras.state;
}


    ngOnInit() {
      const state = this.router.getCurrentNavigation()?.extras.state;

        this.items = [{ label: 'Les compteurs' , routerLink: '/compteurs' }];
       

        this.home = { icon: 'pi pi-compass', routerLink: '/compteurs' };
        let today = new Date();
        this.maxDate = new Date();
        //this.maxDate.setMonth(today.getMonth());
        //this.maxDate.setFullYear(today.getFullYear());
      this.getAllLocaux();
      if(this.compteurEdit){
        this.editCompteur = true;
        this.getDatafromRoute();
        this.pageTitle = "Formulaire de modification d'un compteur ";
      }      

  }

  getDatafromRoute()
  {
    this.compteur = history.state;
    this.dateValue = new Date(this.compteur.dateInstallation);
    this.etat = this.compteur.etatCompteur;
    console.log(this.compteur);
    
  }
  getLocalById(id: any): Observable<Local> {
    return this.localService.getLocalById(id);
  }

  
  save() {
    this.submitted = true;
    
    console.log(this.compteur.refCompteur?.trim()); 

    if (this.compteur.refCompteur?.trim()) {
        console.log(this.compteur);
        this.compteur.uniteMesure=0;
        this.compteur.image=" ";
        this.compteur.etatCompteur = this.etat;
        this.compteur.dateInstallation = this.formatDate(this.dateValue);
        
        if (this.compteur.id) {
            console.log("id update"+this.compteur.id);
            
            this.compteurService.update(this.compteur.id, this.compteur).subscribe(
                response => {
                  console.log('Data updated successfully');
                  this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Compteur mise à jour avec succès', life: 3000 });
                  this.router.navigate(['/compteurs']); 
                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour a échoué', life: 3000 });
                    console.error(error);
                }
              );
        } else {
          
           
            this.compteurService.create(this.compteur).subscribe(
                response => {
                  console.log('counter created successfully');
                  this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Compteur créée avec succès', life: 3000 });
                  this.router.navigate(['/compteurs']);
                  
                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                    console.error(error);
                }
              );
            
        }
    }
}
  
getAllLocaux():void{
  this.localService.findAll().subscribe({
    next:(data)=>{
      this.locaux=data;
      console.log(this.locaux);
      if(this.compteurEdit){
        const idlocal =  String(this.compteur.localID);
        console.log("id "+this.compteur.localID);
        this.local = this.locaux.find(r => r.id == idlocal );
         console.log(this.local);
      }
    },error:(err)=>{
      console.log('error : '+err.message);
    }
  })
}
  onChangeLocal(local:Local){
    console.log(local);
    this.compteur.localID = Number(local.id);
    
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
