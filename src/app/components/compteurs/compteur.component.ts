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
import { CompteurDto } from 'src/app/models/compteurDto';

@Component({
    templateUrl: './compteur.component.html',
    providers: [MessageService]
})
export class CompteurComponent implements OnInit {


    deleteCompteurDialog: boolean = false;

    deleteCompteursDialog: boolean = false;

    compteurs: Compteur[] = [];
    compteursDto: CompteurDto[] = [];

    compteur: Compteur = {};

    selectedCompteurs: Compteur[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    locaux: Local[] = [];
    locauxFiltred: Local[] = [];
    regions: Region[] = [];
    natureExercices : NatureExercise[] = [];
    typeLocaux : TypeLocal[] = [];
    districts: District[] = [];
    district: District = {}
    region: Region = {};
    natureExercice: NatureExercise = {};
    typeLocal: TypeLocal = {};

    selectedRegion:Region = {};
    selectedNatureExercise: NatureExercise = {};
    selectedTypeLocal: TypeLocal = {};

    filter_params: any ={};
    loading: boolean = false;

    constructor(private localService: LocalService, private compteurService: CompteurService,
      private regionService: RegionService, private natureExerciseService : NatureExerciceService,
    private typeLocalService: TypeLocalService, private districtService : DistrictService, private messageService: MessageService,
      private tokenService: TokenStorageService, private router: Router) { }

    ngOnInit() {
      this.loading = true;
      this.items = [{ label: 'Les compteurs' , routerLink: '/compteurs' }];

        this.home = { icon: 'pi pi-compass', routerLink: '/compteurs' };

        this.findAll();

        this.cols = [
            { field: 'refCompteur', header: 'réf Compteur' },
            { field: 'refContrat', header: 'réf Contrat' },
            { field: 'image', header: 'Image' },
            { field: 'dateInstallation', header: 'Date Installat°' },
            { field: 'localID', header: 'Local' },
            { field: 'uniteMesure', header: 'Unité Mesure' },
            { field: 'etatCompteur', header: 'Etat' },

        ];
        this.getAllDistricts();
      this.getAllNatureExercises();
      this.getAllTypeLocal();
      this.getAllLocaux();
      this.loading = false;

    }
    findAll():void{
        this.compteurService.findAll().subscribe({
          next:(data)=>{
            this.compteurs=data;
          },error:(err)=>{
            console.log('error : '+err.message);
          }
        })
      }

      getLocalName(localID: any): string {
        const local = this.locaux.find((loc) => loc.id === localID);
        return local ? local.code : 'Unknown'; 
      }
    compteurForms() {
      this.router.navigate(['/compteurForms']);
    }
    editCompteur(compteur : Compteur) {
      this.router.navigateByUrl('/compteurForms', { state: compteur });
    }

    deleteSelectedCompteurs() {
        this.deleteCompteursDialog = true;
    }

    delete(compteur: Compteur) {
        this.deleteCompteurDialog = true;
        this.compteur = { ...compteur };
    }

    confirmDeleteSelected() {
        this.deleteCompteursDialog = false;
       this.compteurService.deleteSelectedRows(this.selectedCompteurs).subscribe(
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
        this.selectedCompteurs = [];
    }
   

    toggleRowSelection(rowId: number) {
        if (this.selectedRows.includes(rowId)) {
          this.selectedRows = this.selectedRows.filter(id => id !== rowId);
        } else {
          this.selectedRows.push(rowId);
        }
      }
    
      handleFiltering() {
        this.loading = true;
        const filters = {
          region: this.region, // Value from the selected region dropdown
          nature_exercise: this.natureExercice, // Value from the selected nature exercise dropdown
          type_local: this.typeLocal // Value from the selected type local dropdown
          // Add other filter values as needed
        };
        this.localService.getLocalsByFilters(filters)
        .subscribe((data) => {
          console.log('Filtered locals: ', data);
          // Handle the retrieved data (data will contain the filtered list of locals)
          this.locauxFiltred = data;
          this.compteurService.getCompteursByLocals(data).subscribe((data) => {
            console.log('Filtered compteurs: ', data);
            this.compteurs = [];
            this.compteurs=data;
          });
         
          // Perform necessary actions with the filtered data
        });
        this.loading = false;
      }
      resetFilter(){
        this.loading = true;
        this.compteurs = [];
        this.findAll();
        this.region = {};
        this.district = {};
        this.natureExercice = {};
        this.typeLocal = {};
        this.loading = false;
      }

    confirmDelete() {
        this.deleteCompteurDialog = false;
       this.compteurService.deleteCompteur(this.compteur.id).subscribe(
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
        this.compteur = {};
    }
    
  
   
    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.compteurs.length; i++) {
            if (this.compteurs[i].id === id) {
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
     
      this.filter_params = {
        district: this.district && this.district.libille ? this.district.libille : '',
        region: this.region && this.region.libille ? this.region.libille : '',
        nature_exercice: this.natureExercice && this.natureExercice.designation ? this.natureExercice.designation : '',
        type_local: this.typeLocal && this.typeLocal.designation ? this.typeLocal.designation : '',
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
        // Handle the retrieved data (data will contain the filtered list of locals)
        this.locauxFiltred = data;
        this.compteurService.getCompteursByLocals(data).subscribe((data) => {
          console.log('Filtered compteurs: ', data);
          this.compteurs = [];
          this.compteurs=data;
          if(this.compteurs.length){
            const compteursDto: CompteurDto[] = this.mapCompteurToDto(this.compteurs);
            this.compteurService.DownloadFile(this.filter_params, compteursDto).subscribe(response => {
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
       
        // Perform necessary actions with the filtered data
      });
     
         
     
      
    }

    mapCompteurToDto(compteurs: Compteur[]): CompteurDto[] {
      return compteurs.map((compteur: Compteur) => {
        const compteurDto: CompteurDto = {
          id: compteur.id,
          refCompteur: compteur.refCompteur,
          refContrat: compteur.refContrat,
          dateInstallation: compteur.dateInstallation,
          local: this.getLocalName(compteur.localID),
          etatCompteur: compteur.etatCompteur==true? "Actif" : "Inactif",
        };
        return compteurDto;
      });
    }

   
    
}
