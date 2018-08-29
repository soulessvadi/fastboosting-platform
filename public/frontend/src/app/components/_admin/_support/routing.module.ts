import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { TicketComponent } from "./list-ticket.component";
import { NewComponent } from './new.component';

const routes: Routes = [{
	path: 'clients',
	component: ListComponent
},{
	path: 'boosters',
	component: ListComponent
},{
	path: 'partners',
	component: ListComponent
},{
	path: ':ticket',
	component: TicketComponent
},{
	path: "",
	redirectTo: "clients",
	pathMatch: "full"
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
