import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DistrictsComponent } from './districts.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DistrictsComponent }
	])],
	exports: [RouterModule]
})
export class DistrictsRoutingModule { }
