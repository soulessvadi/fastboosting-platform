import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { HistoryComponent } from "./history.component";
import { ActiveComponent } from "./active.component";

const routes: Routes = [{
	path: 'pending',
	component: ListComponent
},{
	path: 'history',
	component: HistoryComponent
},{
	path: 'active',
	component: ActiveComponent
},{
	path: "**",
	redirectTo: "pending",
	pathMatch: "full"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class OrdersRoutingModule { }
