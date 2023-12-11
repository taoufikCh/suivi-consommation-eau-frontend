import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Bordereau } from 'src/app/models/bordereau';
import { Compteur } from 'src/app/models/compteur';
import { Consommation } from 'src/app/models/consommation';
import { Local } from 'src/app/models/local';
import { BordereauService } from 'src/app/service/bordereau.service';
import { CompteurService } from 'src/app/service/compteur.service';
import { ConsommationService } from 'src/app/service/consommation.service';

@Component({
  templateUrl: './consommation.component.html',
  providers: [MessageService],

})

export class ConsommationComponent implements OnInit{
 
  compteur: Compteur = {};
  consommation: Consommation = {};
  compteurs: Compteur []= [];
  bordereaux: Bordereau []= [];
  consommationEdit: Compteur ={};
  submitted: boolean = false;
  editConsommation : boolean = false;
  items: MenuItem[] | undefined;
  minDate: Date | undefined;

    maxDate: Date | undefined;
    etat: boolean = true;
    dateDebut: Date;
    dateFin: Date;
  home: MenuItem | undefined;
  pageTitle : String= "Formulaire d'ajout d'une consommation d'eau ";
  inputStyle = '';
  

  constructor(private consommationService: ConsommationService, private compteurService: CompteurService,
      private messageService: MessageService, private bordereauService: BordereauService,
 private router: Router ) {  
  this.consommationEdit =this.router.getCurrentNavigation()?.extras.state;
}


    ngOnInit() {
      const state = this.router.getCurrentNavigation()?.extras.state;

        this.items = [{ label: 'Les consommations' , routerLink: '/consommations' }];
       

        this.home = { icon: 'pi pi-calculator', routerLink: '/consommations' };
        let today = new Date();
        this.maxDate = new Date();
        //this.maxDate.setMonth(today.getMonth());
        //this.maxDate.setFullYear(today.getFullYear());
      this.getAllCompteurs();
      this.getAllBordereaux();
      if(this.consommationEdit){
        this.editConsommation = true;
        this.getDatafromRoute();
        this.pageTitle = "Formulaire de modification d'une consommation d'eau ";
      }      

  }

  getDatafromRoute()
  {
    this.consommation = history.state;
    this.dateDebut = new Date(this.consommation.dateDebut);
    this.dateFin = new Date(this.consommation.dateFin);
    this.etat = this.consommation.etatFacture;
    console.log(this.compteur);
 
  }

  
  save() {
    this.submitted = true;
    
    console.log(this.consommation.refFacture?.trim()); 

    if (this.consommation.refFacture?.trim()) {
        console.log(this.consommation);
        this.consommation.etatFacture = this.etat;
       this.consommation.dateDebut = this.formatDate(this.dateDebut);
       this.consommation.dateFin = this.formatDate(this.dateFin);
       console.log(this.consommation);
        if (this.consommation.id) {
            console.log("id update"+this.consommation.id);
            
            this.consommationService.update(this.consommation.id, this.consommation).subscribe(
                response => {
                  console.log('Data updated successfully');
                  this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Compteur mise à jour avec succès', life: 3000 });
                  this.router.navigate(['/consommations']); 
                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour a échoué', life: 3000 });
                    console.error(error);
                }
              );
        } else {
          
           
            this.consommationService.create(this.consommation).subscribe(
                response => {
                  console.log('counter created successfully');
                  this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Compteur créée avec succès', life: 3000 });
                  this.router.navigate(['/consommations']);
                  
                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                    console.error(error);
                }
              );
            
        }
    }
}
  
getAllCompteurs():void{
  this.compteurService.findAll().subscribe({
    next:(data)=>{
      this.compteurs=data;
      console.log(this.compteurs);
      if(this.consommationEdit){
        const idCompteur =  this.consommation.compteurId;
        console.log("id "+idCompteur);
        this.compteur = this.compteurs.find(r => r.id == idCompteur );
         console.log(this.compteur);
      }
    },error:(err)=>{
      console.log('error : '+err.message);
    }
  })
}
getAllBordereaux():void{
  this.bordereauService.findAll().subscribe({
    next:(data)=>{
      this.bordereaux=data;
      console.log(this.bordereaux);
    },error:(err)=>{
      console.log('error : '+err.message);
    }
  })
}
  onChangeCompteur(compteur:Compteur){
    console.log(compteur);
    this.consommation.compteurId = compteur.id;
    
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
