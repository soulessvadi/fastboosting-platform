import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { TicketComponent } from "./list-ticket.component";
import { NewComponent } from './new.component';
import { ContactsComponent } from './contacts.component';


const routes: Routes = [{
	path: "",
	redirectTo: "issues",
	pathMatch: "full"
},{
	path: 'issues',
	component: ListComponent
},{
	path: 'issues/:ticket',
	component: TicketComponent
},{
	path: 'newissue',
	component: NewComponent
},{
	path: 'contacts',
	component: ContactsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
