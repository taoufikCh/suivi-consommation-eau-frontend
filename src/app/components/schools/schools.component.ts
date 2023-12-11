import { Component, OnInit, ViewChild } from '@angular/core';
import { School } from 'src/app/models/schools';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SchoolService } from 'src/app/service/school.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { GoogleMap } from '@angular/google-maps';

@Component({
    templateUrl: './schools.component.html',
    providers: [MessageService]
})
export class SchoolsComponent implements OnInit {

    schoolDialog: boolean = false;

    deleteSchoolDialog: boolean = false;

    deleteSchoolsDialog: boolean = false;
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

    schools: School[] = [];

    school: School = {};

    selectedSchools: School[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];
    markers = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private schoolService: SchoolService, private messageService: MessageService,
      private tokenService: TokenStorageService) { }
      @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    ngOnInit() {

        //this.schoolService.getSchools().then(data => this.schools = data);
        this.findAll();

        this.cols = [
            { field: 'name', header: 'Ecole' },
            { field: 'email', header: 'email' },
            { field: 'address', header: 'Adresse' },
        ];
          navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          });

    }
    findAll():void{
        this.schoolService.findAll().subscribe({
          next:(data)=>{
            this.schools=data;
          },error:(err)=>{ //si j'ai une erreur je suis récuperer le message d'erreure pour affiche le message
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.school = {};
        this.submitted = false;
        this.schoolDialog = true;
    }

    deleteSelectedSchools() {
        this.deleteSchoolsDialog = true;
    }

    editSchool(school: School) {
        this.school = { ...school };
        this.addMarker(parseFloat(school.latitude),parseFloat(school.longitude));
        this.schoolDialog = true;
    }

    deleteSchool(school: School) {
        this.deleteSchoolDialog = true;
        this.school = { ...school };
    }

    confirmDeleteSelected() {
        this.deleteSchoolsDialog = false;
        //this.schools = this.schools.filter(val => !this.selectedSchools.includes(val));
        //this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Schools Deleted', life: 3000 });
        this.schoolService.deleteSelectedRows(this.selectedSchools).subscribe(
            response => {
                console.log('School deleted successfully');
                this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Lignes supprimées avec succès', life: 3000 });
                this.findAll();
                
              },
              error => {
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression des lignes', life: 3000 });
                  console.error(error);
              }
            );
        this.selectedSchools = [];
    }

    toggleRowSelection(rowId: number) {
        if (this.selectedRows.includes(rowId)) {
          this.selectedRows = this.selectedRows.filter(id => id !== rowId);
        } else {
          this.selectedRows.push(rowId);
        }
      }
    
      deleteSelectedRows() {
        // Send a request to delete the selected rows
        this.schoolService.deleteSelectedRows(this.selectedSchools).subscribe(
            response => {
                console.log('School deleted successfully');
                this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Lignes supprimées avec succès', life: 3000 });
                this.findAll();
                
              },
              error => {
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression des lignes', life: 3000 });
                  console.error(error);
              }
            );
      }

    confirmDelete() {
        this.deleteSchoolDialog = false;
        
       // this.schools = this.schools.filter(val => val.id !== this.school.id);
       this.schoolService.delete(this.school.id).subscribe(
        response => {
          console.log('School deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'École supprimée avec succès', life: 3000 });
          this.findAll();
          
        },
        error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Supprission a échoué', life: 3000 });
            console.error(error);
        }
      );
        this.school = {};
    }

    hideDialog() {
        this.schoolDialog = false;
        this.submitted = false;
    }
    exportToPdf2(){
      this.schoolService.exportSchoolsToPDF(this.tokenService.getToken()).subscribe(response => {
        const pdfBlob = new Blob([response.body], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      });
    }
    exportToPdf(){
      this.schoolService.DownloadFile().subscribe(response => {
        //console.log(response);
        const pdfBlob = new Blob([response.body], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      });
    }
    
    /*exportToPdf(): void {
      this.schoolService.exportSchoolsToPDF().subscribe(response => {
        const contentType = response.headers.get('Content-Type');
        if (contentType === 'application/pdf') {
          console.log('The response is a PDF.');
          // Handle PDF response here
        } else {
          console.log('The response is not a PDF.');
          // Handle other content types here if needed
        }
      });
    }*/

    saveSchool() {
        this.submitted = true;
        
        console.log(this.school.name?.trim()); 

        if (this.school.name?.trim()) {
            console.log(this.school);
            if (this.school.id) {
                console.log("id "+this.school.id);
                // @ts-ignore
                //this.schools[this.findIndexById(this.school.id)] = this.school;
                //this.schoolService.update(this.school.id, this.school);
                this.schoolService.update(this.school.id, this.school).subscribe(
                    response => {
                      console.log('School updated successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'École mise à jour avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour a échoué', life: 3000 });
                        console.error(error);
                    }
                  );
            } else {
               // this.school.id = this.createId();
                //this.school.code = this.createId();
               
                // @ts-ignore
                
                
                //this.schoolService.createSchool(this.school);
                this.schoolService.createSchool(this.school).subscribe(
                    response => {
                      console.log('School created successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'École créée avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                        console.error(error);
                    }
                  );
                
            }

            this.schools = [...this.schools];
            this.schoolDialog = false;
            this.school = {};
        }
    }
   
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.schools.length; i++) {
            if (this.schools[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    click(event: google.maps.MapMouseEvent) {
      const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    // Update the school.longitude property with the clicked longitude
    this.school.longitude = ''+clickedLng;
    this.school.latitude = ''+clickedLat;
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
