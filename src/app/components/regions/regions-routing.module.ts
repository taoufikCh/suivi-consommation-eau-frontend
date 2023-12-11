import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegionsComponent } from './regions.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RegionsComponent }
	])],
	exports: [RouterModule]
})
export class RegionsRoutingModule { }
