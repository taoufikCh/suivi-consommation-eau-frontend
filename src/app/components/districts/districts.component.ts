
import { Component, OnInit } from '@angular/core';
import { District } from 'src/app/models/districts';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DistrictService } from 'src/app/service/district.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  providers: [MessageService]
})
export class DistrictsComponent implements OnInit {

    modelDialog: boolean = false;


    districts: District[] = [];

    district: District = {};

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private districtService: DistrictService, private messageService: MessageService,
      private tokenService: TokenStorageService) { }

    ngOnInit() {
      this.items = [{ label: 'Les districts' , routerLink: '/districts' }];

        this.home = { icon: 'pi pi-map', routerLink: '/districts' };
        this.findAll();

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'code', header: 'Code' },
            { field: 'libille', header: 'District' },
            { field: 'description', header: 'Description' },
        ];

    }
    findAll():void{
        this.districtService.findAll().subscribe({
          next:(data)=>{
            this.districts=data;
          },error:(err)=>{ 
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.district = {};
        this.submitted = false;
        this.modelDialog = true;
    }

    hideDialog() {
        this.modelDialog = false;
        this.submitted = false;
    }
  
    saveDistrict() {
        this.submitted = true;
        
        console.log(this.district.libille?.trim()); 

        if (this.district.libille?.trim()) {
            console.log(this.district);
            if (this.district.id) {
              
            } else {
              
               
                this.districtService.createDistrict(this.district).subscribe(
                    response => {
                      console.log('District created successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'École créée avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                        console.error(error);
                    }
                  );
                
            }

            this.districts = [...this.districts];
            this.modelDialog = false;
            this.district = {};
        }
    }
   
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.districts.length; i++) {
            if (this.districts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

