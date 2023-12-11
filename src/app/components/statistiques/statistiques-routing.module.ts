import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatistiquesComponent } from './statistiques.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: StatistiquesComponent }
	])],
	exports: [RouterModule]
})
export class StatistiquesRoutingModule { }
