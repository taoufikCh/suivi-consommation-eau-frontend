import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BordereauxComponent } from './bordereaux.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BordereauxComponent }
	])],
	exports: [RouterModule]
})
export class BordereauxRoutingModule { }
