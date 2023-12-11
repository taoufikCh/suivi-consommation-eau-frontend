import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalComponent } from './local.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: LocalComponent }
	])],
	exports: [RouterModule]
})
export class LocalRoutingModule { }
