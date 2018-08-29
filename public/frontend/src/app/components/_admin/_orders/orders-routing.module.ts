import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { ProblematicComponent } from "./problematic.component";
import { HistoryComponent } from "./history.component";
import { ActiveComponent } from "./active.component";

const routes: Routes = [{
	path: '',
	redirectTo: 'actual'
},{
	path: 'actual',
	component: ListComponent
},{
	path: 'problematic',
	component: ProblematicComponent
},{
	path: 'history',
	component: HistoryComponent
},{
	path: ':number',
	component: ActiveComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class OrdersRoutingModule { }
