import { Component, OnInit, ViewChild } from '@angular/core';
import { Local } from 'src/app/models/local';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalService } from 'src/app/service/local.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { GoogleMap } from '@angular/google-maps';
import { NavigationExtras, Router } from '@angular/router';

@Component({
    templateUrl: './local.component.html',
    providers: [MessageService]
})
export class LocalComponent implements OnInit {

    localDialog: boolean = false;

    deleteLocalDialog: boolean = false;

    deleteLocauxDialog: boolean = false;
    zoom = 12;
    center: google.maps.LatLngLiteral;
    options: google.maps.MapOptions = {
      //zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false,
      mapTypeId: 'hybrid',
      maxZoom: 15,
      minZoom: 5,
  };
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

    locaux: Local[] = [];

    local: Local = {};

    selectedLocaux: Local[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];
    markers = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private localService: LocalService, private messageService: MessageService,
      private tokenService: TokenStorageService, private router: Router) { }
      @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    ngOnInit() {
      this.items = [{ label: 'Les Locaux' , routerLink: '/locaux' }];

        this.home = { icon: 'pi pi-building', routerLink: '/locaux' };

        this.findAll();

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'designation', header: 'Désignation' },
            { field: 'image', header: 'Image' },
            { field: 'address', header: 'Adresse' },
            { field: 'longitude', header: 'Longitude' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'region', header: 'Région' },
            { field: 'type_local', header: 'Type local' },
            { field: 'nature_exercise', header: 'Nature exercice' },
            { field: 'etat', header: 'Etat' },
        ];
          navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          });

    }
    findAll():void{
        this.localService.findAll().subscribe({
          next:(data)=>{
            this.locaux=data;
          },error:(err)=>{
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.local = {};
        this.submitted = false;
        this.localDialog = true;
    }
    localForms() {
      this.router.navigate(['/localForms']);
    }
    editLocal(local : Local) {
       
      /*const navigationExtras: NavigationExtras = {
        state: {
          // Add your data to the state
          data: local
        }
      };*/
  
      //this.router.navigate(['/localForms'], navigationExtras);
      this.router.navigateByUrl('/localForms', { state: local });
    }

    deleteSelectedLocaux() {
        this.deleteLocauxDialog = true;
    }

    edit(local: Local) {
        this.local = { ...local };
        this.addMarker(parseFloat(local.latitude),parseFloat(local.longitude));
        this.localDialog = true;
    }

    delete(local: Local) {
        this.deleteLocalDialog = true;
        this.local = { ...local };
    }

    confirmDeleteSelected() {
        this.deleteLocauxDialog = false;
       this.localService.deleteSelectedRows(this.selectedLocaux).subscribe(
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
        this.selectedLocaux = [];
    }
   

    toggleRowSelection(rowId: number) {
        if (this.selectedRows.includes(rowId)) {
          this.selectedRows = this.selectedRows.filter(id => id !== rowId);
        } else {
          this.selectedRows.push(rowId);
        }
      }
    
     

    confirmDelete() {
        this.deleteLocalDialog = false;
       this.localService.deleteLocal(this.local.id).subscribe(
        response => {
          console.log('data deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'local supprimé avec succès', life: 3000 });
          this.findAll();
          
        },
        error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Supprission a échoué', life: 3000 });
            console.error(error);
        }
      );
        this.local = {};
    }
    

    hideDialog() {
        this.localDialog = false;
        this.submitted = false;
    }
    exportToPdf2(){
      this.localService.exportLocauxToPDF(this.tokenService.getToken()).subscribe(response => {
        const pdfBlob = new Blob([response.body], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      });
    }
    exportToPdf(){
      this.localService.DownloadFile().subscribe(response => {
        //console.log(response);
        const pdfBlob = new Blob([response.body], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      });
    }
    
  
    save() {
        this.submitted = true;
        
        console.log(this.local.designation?.trim()); 

        if (this.local.designation?.trim()) {
            console.log(this.local);
            if (this.local.id) {
                console.log("id "+this.local.id);
                
                this.localService.update(this.local.id, this.local).subscribe(
                    response => {
                      console.log('Data updated successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Local mise à jour avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour a échoué', life: 3000 });
                        console.error(error);
                    }
                  );
            } else {
               
                this.localService.create(this.local).subscribe(
                    response => {
                      console.log('local created successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'École créée avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                        console.error(error);
                    }
                  );
                
            }

            this.locaux = [...this.locaux];
            this.localDialog = false;
            this.local = {};
        }
    }
   
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.locaux.length; i++) {
            if (this.locaux[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

   

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    click(event: google.maps.MapMouseEvent) {
      const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    this.local.longitude = ''+clickedLng;
    this.local.latitude = ''+clickedLat;
      console.log("lat = "+event.latLng.lat());
      console.log("lng = "+event.latLng.lng());
      this.addMarker(clickedLat,clickedLng);
    }

    addMarker(lat :number, lng : number) {
      this.markers = [];
      this.markers.push({
        position: {
          lat: lat ,
          lng: lng ,
        },
        
       
      });
      
    }
   
    logCenter() {
      console.log(JSON.stringify(this.map.getCenter()));
    }
}
