import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsommationsComponent } from './consommations.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ConsommationsComponent }
	])],
	exports: [RouterModule]
})
export class ConsommationsRoutingModule { }
