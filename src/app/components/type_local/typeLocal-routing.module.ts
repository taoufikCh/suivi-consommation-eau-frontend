import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TypeLocalComponent } from './typeLocal.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TypeLocalComponent }
	])],
	exports: [RouterModule]
})
export class TypeLocalRoutingModule { }
