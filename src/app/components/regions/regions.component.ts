
import { Component, OnInit } from '@angular/core';
import { Region } from 'src/app/models/region';
import { District } from 'src/app/models/districts';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DistrictService } from 'src/app/service/district.service';
import { RegionService } from 'src/app/service/region.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  providers: [MessageService]
})
export class RegionsComponent implements OnInit {

    modelDialog: boolean = false;
    regions: Region[] = [];

    region: Region = {};

    submitted: boolean = false;

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;
    
    cols: any[] = [];
    districts: District[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private districtService: DistrictService, private regionService: RegionService ,private messageService: MessageService) { }

    ngOnInit() {
      this.items = [{ label: 'Les régions' , routerLink: '/regions' }];

        this.home = { icon: 'pi pi-sitemap', routerLink: '/regions' };
        this.findAll();

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'code', header: 'Code' },
            { field: 'libille', header: 'Région' },
            { field: 'district', header: 'District' },
        ];

    }
    findAll():void{
        this.regionService.findAll().subscribe({
          next:(data)=>{
            this.regions=data;
          },error:(err)=>{ 
            console.log('error : '+err.message);
          }
        })
      }

      findAllDistrict():void{
        this.districtService.findAll().subscribe({
          next:(data)=>{
            this.districts=data;
          },error:(err)=>{ 
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.region = {};
        this.findAllDistrict();
        this.submitted = false;
        this.modelDialog = true;
    }

    hideDialog() {
        this.modelDialog = false;
        this.submitted = false;
    }
  
    saveDistrict() {
        this.submitted = true;
        
        console.log(this.region.libille?.trim()); 

        if (this.region.libille?.trim()) {
            console.log(this.region);
            if (this.region.id) {
              
            } else {
              
               
                this.regionService.createRegion(this.region).subscribe(
                    response => {
                      console.log('Region created successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Région créée avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                        console.error(error);
                    }
                  );
                
            }

            this.regions = [...this.regions];
            this.modelDialog = false;
            this.region = {};
        }
    }
   
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.regions.length; i++) {
            if (this.regions[i].id === id) {
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

