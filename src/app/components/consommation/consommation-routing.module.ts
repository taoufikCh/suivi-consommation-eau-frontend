import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsommationComponent } from './consommation.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ConsommationComponent }
	])],
	exports: [RouterModule]
})
export class ConsommationRoutingModule { }
