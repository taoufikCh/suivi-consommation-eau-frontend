import { Component, OnInit } from '@angular/core';
import { TypeLocal } from 'src/app/models/typeLocal';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TypeLocalService } from 'src/app/service/type-local.service';

@Component({
    templateUrl: './typeLocal.component.html',
    providers: [MessageService]
})
export class TypeLocalComponent implements OnInit {

    typeLocalDialog: boolean = false;

    deleteTypeLocalDialog: boolean = false;

    deleteTypeLocauxDialog: boolean = false;

    typeLocaux: TypeLocal[] = [];

    typeLocal: TypeLocal = {};

    selectedTypeLocaux: TypeLocal[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];


    rowsPerPageOptions = [5, 10, 20];

    constructor(private typeLocalService: TypeLocalService, private messageService: MessageService) { }

    ngOnInit() {
        this.findAll();

        this.cols = [
            { field: 'designation', header: 'Type Local' },
        ];

    }
    findAll():void{
        this.typeLocalService.findAll().subscribe({
          next:(data)=>{
            this.typeLocaux=data;
          },error:(err)=>{ 
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.typeLocal = {};
        this.submitted = false;
        this.typeLocalDialog = true;
    }

    deleteSelectedItems() {
        this.deleteTypeLocauxDialog = true;
    }

    edit(typeLocal: TypeLocal) {
        this.typeLocal = { ...typeLocal };
        this.typeLocalDialog = true;
    }

    delete(typeLocal: TypeLocal) {
        this.deleteTypeLocalDialog = true;
        this.typeLocal = { ...typeLocal };
    }

    confirmDeleteSelected() {
        this.deleteTypeLocauxDialog = false;
         this.typeLocalService.deleteSelectedRows(this.selectedTypeLocaux).subscribe(
            response => {
                console.log('row deleted successfully');
                this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Lignes supprimées avec succès', life: 3000 });
                this.findAll();
                
              },
              error => {
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression des lignes', life: 3000 });
                  console.error(error);
              }
            );
        this.selectedTypeLocaux = [];
    }

    toggleRowSelection(rowId: number) {
        if (this.selectedRows.includes(rowId)) {
          this.selectedRows = this.selectedRows.filter(id => id !== rowId);
        } else {
          this.selectedRows.push(rowId);
        }
      }
    
      

    confirmDelete() {
        this.deleteTypeLocalDialog = false;
        
       this.typeLocalService.delete(this.typeLocal.id).subscribe(
        response => {
          console.log('data deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Ligne supprimée avec succès', life: 3000 });
          this.findAll();
          
        },
        error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Supprission a échoué', life: 3000 });
            console.error(error);
        }
      );
        this.typeLocal = {};
    }

    hideDialog() {
        this.typeLocalDialog = false;
        this.submitted = false;
    }
    
    save() {
        this.submitted = true;
        
        console.log(this.typeLocal.designation?.trim()); 

        if (this.typeLocal.designation?.trim()) {
            console.log(this.typeLocal);
            if (this.typeLocal.id) {
                console.log("id "+this.typeLocal.id);

                this.typeLocalService.update(this.typeLocal).subscribe(
                    response => {
                      console.log('row updated successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Données mise à jour avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour a échoué', life: 3000 });
                        console.error(error);
                    }
                  );
            } else {
                this.typeLocalService.create(this.typeLocal).subscribe(
                    response => {
                      console.log('row created successfully');
                      this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Les données sont enregistrées avec succès', life: 3000 });
                      this.findAll();
                      
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                        console.error(error);
                    }
                  );
                
            }

            this.typeLocaux = [...this.typeLocaux];
            this.typeLocalDialog = false;
            this.typeLocal = {};
        }
    }
   
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.typeLocaux.length; i++) {
            if (this.typeLocaux[i].id === id) {
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
