import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from "./statistics.component";
import { ListComponent } from "./list.component";
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';

const routes: Routes = [{
	path: 'statistics',
	component: StatisticsComponent
},{
	path: 'list',
	component: ListComponent
},{
	path: 'new',
	component: NewComponent
},{
	path: ':id',
	component: EditComponent
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
