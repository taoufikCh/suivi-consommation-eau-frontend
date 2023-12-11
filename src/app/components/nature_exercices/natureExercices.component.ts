import { Component, OnInit } from '@angular/core';
import { NatureExercise } from 'src/app/models/natureExercice';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { NatureExerciceService } from 'src/app/service/nature-exercice.service';

@Component({
    templateUrl: './natureExercices.component.html',
    providers: [MessageService]
})
export class NatureExercicesComponent implements OnInit {

    natureExerciceDialog: boolean = false;

    deleteNatureExDialog: boolean = false;

    deleteNatureExercisesDialog: boolean = false;

    natureExercises: NatureExercise[] = [];

    natureExercise: NatureExercise = {};

    selectedNatureExercices: NatureExercise[] = [];
    selectedRows: number[] = [];

    submitted: boolean = false;

    cols: any[] = [];


    rowsPerPageOptions = [5, 10, 20];

    constructor(private natureExerciseService: NatureExerciceService, private messageService: MessageService,
      private tokenService: TokenStorageService) { }

    ngOnInit() {
        this.findAll();

        this.cols = [
            { field: 'designation', header: 'Nature Exercice' },
        ];

    }
    findAll():void{
        this.natureExerciseService.findAll().subscribe({
          next:(data)=>{
            this.natureExercises=data;
          },error:(err)=>{ //si j'ai une erreur je suis récuperer le message d'erreure pour affiche le message
            console.log('error : '+err.message);
          }
        })
      }

    openNew() {
        this.natureExercise = {};
        this.submitted = false;
        this.natureExerciceDialog = true;
    }

    deleteSelectedNatureExercices() {
        this.deleteNatureExercisesDialog = true;
    }

    editNatureExercice(natureExercise: NatureExercise) {
        this.natureExercise = { ...natureExercise };
        this.natureExerciceDialog = true;
    }

    deleteNatureExercice(natureExercise: NatureExercise) {
        this.deleteNatureExDialog = true;
        this.natureExercise = { ...natureExercise };
    }

    confirmDeleteSelected() {
        this.deleteNatureExercisesDialog = false;
         this.natureExerciseService.deleteSelectedRows(this.selectedNatureExercices).subscribe(
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
        this.selectedNatureExercices = [];
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
        this.natureExerciseService.deleteSelectedRows(this.selectedNatureExercices).subscribe(
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
      }

    confirmDelete() {
        this.deleteNatureExDialog = false;
        
       this.natureExerciseService.delete(this.natureExercise.id).subscribe(
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
        this.natureExercise = {};
    }

    hideDialog() {
        this.natureExerciceDialog = false;
        this.submitted = false;
    }
   
    
    
    saveNatureExercice() {
        this.submitted = true;
        
        console.log(this.natureExercise.designation?.trim()); 

        if (this.natureExercise.designation?.trim()) {
            console.log(this.natureExercise);
            if (this.natureExercise.id) {
                console.log("id "+this.natureExercise.id);

                this.natureExerciseService.update(this.natureExercise).subscribe(
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
                this.natureExerciseService.create(this.natureExercise).subscribe(
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

            this.natureExercises = [...this.natureExercises];
            this.natureExerciceDialog = false;
            this.natureExercise = {};
        }
    }
   
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.natureExercises.length; i++) {
            if (this.natureExercises[i].id === id) {
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
