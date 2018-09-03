import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { PrivComponent } from "./priv.component";
import { PrivEditComponent } from "./priv-edit.component";
import { PrivNewComponent } from "./priv-new.component";
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';
import { AllUsersComponent } from './allusers.component';
import { AllUsersEditComponent } from './allusers-edit.component';

const routes: Routes = [{
	path: 'clients',
	component: ListComponent
},{
	path: 'clients/new',
	component: NewComponent
},{
	path: 'clients/:id',
	component: EditComponent
},{
	path: 'privileges',
	component: PrivComponent
},{
	path: 'privileges/new',
	component: PrivNewComponent
},{
	path: 'privileges/:id',
	component: PrivEditComponent
},{
	path: 'list',
	component: AllUsersComponent
},{
	path: ':id',
	component: AllUsersEditComponent
},{
	path: "",
	redirectTo: "clients",
	pathMatch: "full"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
