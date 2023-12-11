import { Component, OnInit } from '@angular/core';
import { Bordereau } from 'src/app/models/bordereau';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BordereauService } from 'src/app/service/bordereau.service';

@Component({
    templateUrl: './Bordereaux.component.html',
    providers: [MessageService]
})
export class BordereauxComponent implements OnInit {

    bordereauDialog: boolean = false;

    deleteBordereauDialog: boolean = false;

    deleteBordereauxDialog: boolean = false;

    bordereaux: Bordereau[] = [];

    bordereau: Bordereau = {};

    selectedBordereaux: Bordereau[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;
    rowsPerPageOptions = [5, 10, 20];

    constructor(private bordereauService: BordereauService, private messageService: MessageService) { }

    ngOnInit() {
      this.items = [{ label: 'Les bordereaux' , routerLink: '/bordereaux' }];

      this.home = { icon: 'pi pi-book', routerLink: '/bordereaux' };
        this.findAll();

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'dateGeneration', header: 'Date généraiion' },
        ];

    }
    findAll():void{
        this.bordereauService.findAll().subscribe({
          next:(data)=>{
            this.bordereaux=data;
          },error:(err)=>{ //si j'ai une erreur je suis récuperer le message d'erreure pour affiche le message
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.bordereau = {};
        this.submitted = false;
        this.bordereauDialog = true;
    }

    deleteSelected() {
        this.deleteBordereauxDialog = true;
    }

    edit(bordereau: Bordereau) {
        this.bordereau = { ...bordereau };
        this.bordereauDialog = true;
    }

    delete(bordereau: Bordereau) {
        this.deleteBordereauDialog = true;
        this.bordereau = { ...bordereau };
    }

    confirmDeleteSelected() {
        this.deleteBordereauxDialog = false;
         this.bordereauService.deleteSelectedRows(this.selectedBordereaux).subscribe(
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
        this.selectedBordereaux = [];
    }

    toggleRowSelection(rowId: number) {
        if (this.selectedRows.includes(rowId)) {
          this.selectedRows = this.selectedRows.filter(id => id !== rowId);
        } else {
          this.selectedRows.push(rowId);
        }
      }
    
      
    confirmDelete() {
        this.deleteBordereauDialog = false;
        
       this.bordereauService.delete(this.bordereau.id).subscribe(
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
        this.bordereau = {};
    }

    hideDialog() {
        this.bordereauDialog = false;
        this.submitted = false;
    }
   
    
    
    save() {
        this.submitted = true;
        
        console.log(this.bordereau.code?.trim()); 

        if (this.bordereau.code?.trim()) {
            console.log(this.bordereau);
            if (this.bordereau.id) {
                console.log("id "+this.bordereau.id);

                this.bordereauService.update(this.bordereau).subscribe(
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
                this.bordereauService.create(this.bordereau).subscribe(
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

            this.bordereaux = [...this.bordereaux];
            this.bordereauDialog = false;
            this.bordereau = {};
        }
    }
   
    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.bordereaux.length; i++) {
            if (this.bordereaux[i].id === id) {
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
