import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';
import { StatisticsComponent } from './statistics.component';


const routes: Routes = [{
	path: 'list',
	component: ListComponent
},{
	path: 'statistics',
	component: StatisticsComponent
},{
	path: 'new',
	component: NewComponent
},{
	path: ':id',
	component: EditComponent
},{
	path: "",
	redirectTo: "list",
	pathMatch: "full"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
