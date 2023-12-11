import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompteurComponent } from './compteur.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CompteurComponent }
	])],
	exports: [RouterModule]
})
export class CompteurRoutingModule { }
