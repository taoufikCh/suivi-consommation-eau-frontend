import { Component, OnInit, ViewChild } from '@angular/core';
import { Local } from 'src/app/models/local';
import { Compteur } from 'src/app/models/compteur';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalService } from 'src/app/service/local.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { Router } from '@angular/router';
import { CompteurService } from 'src/app/service/compteur.service';
import { Region } from 'src/app/models/region';
import { NatureExercise } from 'src/app/models/natureExercice';
import { TypeLocal } from 'src/app/models/typeLocal';
import { District } from 'src/app/models/districts';
import { RegionService } from 'src/app/service/region.service';
import { NatureExerciceService } from 'src/app/service/nature-exercice.service';
import { TypeLocalService } from 'src/app/service/type-local.service';
import { DistrictService } from 'src/app/service/district.service';
import { Consommation } from 'src/app/models/consommation';
import { ConsommationService } from 'src/app/service/consommation.service';
import { Bordereau } from 'src/app/models/bordereau';
import { ConsommationDto } from 'src/app/models/consommationDto';

@Component({
    templateUrl: './consommations.component.html',
    providers: [MessageService]
})
export class ConsommationsComponent implements OnInit {


    deleteConsommationDialog: boolean = false;

    deleteConsommationsDialog: boolean = false;

    consommations: Consommation[] = [];
    consommationsDto: ConsommationDto[] = [];

    consommation: Consommation = {};
    bordereau: Bordereau = {};

    selectedConsommations: Consommation[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;
    compteurs: Compteur[] = [];
    compteursId : number[]= [];
    compteur : Compteur = {};
    locaux: Local[] = [];
    regions: Region[] = [];
    natureExercices : NatureExercise[] = [];
    typeLocaux : TypeLocal[] = [];
    districts: District[] = [];
    district: District = {}
    region: Region = {};
    natureExercice: NatureExercise = {};
    typeLocal: TypeLocal = {};
    dates: Date[] | undefined;
    maxDate: Date | undefined;
    dateDebut: Date;
    dateFin: Date;
    startDate:String ="";
    endDate:String ="";
    startDate1:String ="";
    endDate1:String ="";
    filter_params: any ={};
    
    loading: boolean = false;
    constructor(private localService: LocalService, private consommationService: ConsommationService,private compteurService: CompteurService,
      private regionService: RegionService, private natureExerciseService : NatureExerciceService,
    private typeLocalService: TypeLocalService, private districtService : DistrictService, private messageService: MessageService,
       private router: Router) { }

    ngOnInit() {
      this.loading = true;
      this.items = [{ label: 'Les consommations' , routerLink: '/consommations' }];

        this.home = { icon: 'pi pi-calculator', routerLink: '/consommations' };
        this.maxDate = new Date();
        this.findAll();

        this.cols = [
            { field: 'compteurId', header: 'Compteur' },
            { field: 'refFacture', header: 'réf facture' },
            { field: 'bordereau', header: 'Bordereau' },
            { field: 'periode', header: 'Période' },
            { field: 'ancienIndex', header: 'Ancien Index' },
            { field: 'nouveauIndex', header: 'Nouveau Index' },
            { field: 'quantite', header: 'Quantité' },
            { field: 'montant', header: 'Montant' },
            { field: 'etatFacture', header: 'Etat' },

        ];
        this.getAllDistricts();
        this.getAllCompteurs();
        this.getAllNatureExercises();
        this.getAllTypeLocal();
        this.getAllLocaux();
          
        this.loading = false;
    }
    findAll():void{
        this.consommationService.findAll().subscribe({
          next:(data)=>{
            this.consommations=data;
            console.log(this.consommations);
          },error:(err)=>{
            console.log('error : '+err.message);
          }
        })
      }

      getCompteurRef(compteurID: any): string {
        const c = this.compteurs.find((compteur) => compteur.id === compteurID);
        return c ? c.refCompteur : 'Unknown'; 
      }
    consommationForms() {
      this.router.navigate(['/consommationForms']);
    }
    editConsommation(consommation : Consommation) {
      this.router.navigateByUrl('/consommationForms', { state: consommation });
    }

    deleteSelectedConsommations() {
        this.deleteConsommationsDialog = true;
    }

    delete(consommation: Consommation) {
        this.deleteConsommationDialog = true;
        this.consommation = { ...consommation };
    }

    confirmDeleteSelected() {
        this.deleteConsommationsDialog = false;
       this.consommationService.deleteSelectedRows(this.selectedConsommations).subscribe(
            response => {
                console.log('data deleted successfully');
                this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Lignes supprimées avec succès', life: 3000 });
                this.findAll();
                
              },
              error => {
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression des lignes', life: 3000 });
                  console.error(error);
              }
            );
        this.selectedConsommations = [];
    }
    resetFilter(){
      this.loading = true;
      this.consommations = [];
      this.findAll(); 
      this.compteurs = [];
      this.region = {};
      this.district = {};
      this.natureExercice = {};
      this.typeLocal = {};
      this.dateDebut=null;
      this.dateFin=null;
      this.loading = false;
    }

    handleFiltering() {
      this.loading = true;
      const filters = {
        region: this.region, // Value from the selected region dropdown
        nature_exercise: this.natureExercice, // Value from the selected nature exercise dropdown
        type_local: this.typeLocal // Value from the selected type local dropdown
        // Add other filter values as needed
      };
      if(this.dateDebut!=null){
         this.startDate = this.formatDate(this.dateDebut);
      }
      if(this.dateFin!=null){
        this.endDate = this.formatDate(this.dateFin);
     }
         
      this.localService.getLocalsByFilters(filters)
      .subscribe((data) => {
        console.log('Filtered locals: ', data);
        // Handle the retrieved data (data will contain the filtered list of locals)
        //this.locauxFiltred = data;
        this.compteurService.getCompteursByLocals(data).subscribe((data) => {
          console.log('Filtered compteurs: ', data);
          //this.compteurs = [];
          this.compteurs=data;
          this.compteursId = data.map((compteur: any) => compteur.id);
          console.log('Compteurs IDs: ', this.compteursId);
          
          const consommationFilters = {
            compteurId: this.compteursId, // Value from the selected region dropdown
            dateDebut: this.startDate,
            dateFin: this.endDate
            // Add other filter values as needed
          };
          this.consommationService.getConsommationsByFilters(consommationFilters)
          .subscribe((data) => {
              console.log('Filtered consommations: ', data);
              this.consommations = [];
              this.consommations=data;
           
            // Perform necessary actions with the filtered data
          });
        });

      
       
        // Perform necessary actions with the filtered data
      });
      this.loading = false;
    }
   

    toggleRowSelection(rowId: number) {
        if (this.selectedRows.includes(rowId)) {
          this.selectedRows = this.selectedRows.filter(id => id !== rowId);
        } else {
          this.selectedRows.push(rowId);
        }
      }
    
      formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      formatDateToYearMonth(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
      }

    confirmDelete() {
        this.deleteConsommationDialog = false;
       this.consommationService.delete(this.consommation.id).subscribe(
        response => {
          console.log('data deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Compteur supprimé avec succès', life: 3000 });
          this.findAll();
          
        },
        error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Supprission a échoué', life: 3000 });
            console.error(error);
        }
      );
        this.consommation = {};
    }
    

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.consommations.length; i++) {
            if (this.consommations[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

   

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getAllDistricts():void{
      this.districtService.findAll().subscribe({
        next:(data)=>{
          this.districts=data;
        },error:(err)=>{ 
          console.log('error : '+err.message);
        }
      })
    }

    getAllCompteurs():void{
      this.compteurService.findAll().subscribe({
        next:(data)=>{
          this.compteurs=data;
        },error:(err)=>{ 
          console.log('error : '+err.message);
        }
      })
    }
    getAllNatureExercises():void{
      this.natureExerciseService.findAll().subscribe({
        next:(data)=>{
          this.natureExercices=data;
        },error:(err)=>{ //si j'ai une erreur je suis récuperer le message d'erreure pour affiche le message
          console.log('error : '+err.message);
        }
      })
    }
    getAllTypeLocal():void{
      this.typeLocalService.findAll().subscribe({
        next:(data)=>{
          this.typeLocaux=data;
        },error:(err)=>{ 
          console.log('error : '+err.message);
        }
      })
    }

    getAllLocaux():void{
      this.localService.findAll().subscribe({
        next:(data)=>{
          this.locaux=data;
        },error:(err)=>{
          console.log('error : '+err.message);
        }
      })
    }
    onChangeDistrict(district:District){
      this.regions = [...this.regions];
      console.log(district);
      this.district = district;
      this.regionService.getRegionByDistrict(district).subscribe({
        next:(data)=>{
          this.regions=data;
            this.region = this.regions[0];
             console.log(this.region);
        },error:(err)=>{ 
          console.log('error : '+err.message);
        }
      })
      
    }
    exportToPdf(){
      this.loading = true;
      if(this.dateDebut!=null){
        this.startDate = this.formatDate(this.dateDebut);
     }
     if(this.dateFin!=null){
       this.endDate = this.formatDate(this.dateFin);
    }
    if (this.dateDebut != null) {
      this.startDate1 = this.formatDateToYearMonth(this.dateDebut);
    }
    if(this.dateFin!=null){
      this.endDate1 = this.formatDateToYearMonth(this.dateFin);
   }
      this.filter_params = {
        district: this.district && this.district.libille ? this.district.libille : '',
        region: this.region && this.region.libille ? this.region.libille : '',
        nature_exercice: this.natureExercice && this.natureExercice.designation ? this.natureExercice.designation : '',
        type_local: this.typeLocal && this.typeLocal.designation ? this.typeLocal.designation : '',
        local: '',
        dateDebut: this.startDate1,
        dateFin: this.endDate1
    };
      console.log(this.filter_params);
      const filters = {
        region: this.region, // Value from the selected region dropdown
        nature_exercise: this.natureExercice, // Value from the selected nature exercise dropdown
        type_local: this.typeLocal // Value from the selected type local dropdown
        // Add other filter values as needed
      };
     
         
      this.localService.getLocalsByFilters(filters)
      .subscribe((data) => {
        console.log('Filtered locals: ', data);
        this.compteurService.getCompteursByLocals(data).subscribe((data) => {
          console.log('Filtered compteurs: ', data);
          this.compteurs=data;
          this.compteursId = data.map((compteur: any) => compteur.id);
          console.log('Compteurs IDs: ', this.compteursId);
          
          const consommationFilters = {
            compteurId: this.compteursId, // Value from the selected region dropdown
            dateDebut: this.startDate,
            dateFin: this.endDate
          };
          this.consommationService.getConsommationsByFilters(consommationFilters)
          .subscribe((data) => {
              console.log('Filtered consommations: ', data);
              this.consommations = [];
              this.consommations=data;
              if(this.consommations.length){
                const consommationsDto: ConsommationDto[] = this.mapConsommationToDto(this.consommations);
                this.consommationService.DownloadFile(this.filter_params, consommationsDto).subscribe(response => {
                  //console.log(response);
                  const pdfBlob = new Blob([response.body], { type: 'application/pdf' });
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  window.open(pdfUrl, '_blank');
                  this.loading = false;
                });
              }
              else{
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Pas de données', life: 3000 });
              }
               
          });
        });
      });
      
    }

    mapConsommationToDto(consommations: Consommation[]): ConsommationDto[] {
      return consommations.map((consommation: Consommation) => {
        const consommationDto: ConsommationDto = {
          id: consommation.id,
          refFacture: consommation.refFacture,
          quantite: consommation.quantite,
          ancienIndex: consommation.ancienIndex,
          nouveauIndex: consommation.nouveauIndex,
          dateDebut: consommation.dateDebut,
          dateFin: consommation.dateFin,
          compteur: this.getCompteurRef(consommation.compteurId) , // Assuming compteurId is a number
          etatFacture: consommation.etatFacture==true? "Oui" : "Non",
          montant: consommation.montant,
          bordereau: consommation.bordereau ? consommation.bordereau.code.toString() : '', // Assuming bordereau.id is a number
        };
        return consommationDto;
      });
    }

   
    
}
