import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricelistsComponent } from './pricelists.component';

const routes: Routes = [{
	path: 'pricelists',
	component: PricelistsComponent
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
