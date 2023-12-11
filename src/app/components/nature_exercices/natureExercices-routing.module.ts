import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NatureExercicesComponent } from './natureExercices.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NatureExercicesComponent }
	])],
	exports: [RouterModule]
})
export class NatureExercicesRoutingModule { }
