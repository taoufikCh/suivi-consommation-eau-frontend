import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateLocalComponent } from './create-local.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateLocalComponent }
	])],
	exports: [RouterModule]
})
export class CreateLocalRoutingModule { }
