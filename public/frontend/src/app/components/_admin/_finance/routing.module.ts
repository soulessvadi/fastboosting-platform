import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoosterPayoffComponent } from "./booster-payoff.component";
import { ClientRefillComponent } from "./client-refill.component";
import { ClientWriteoffComponent } from "./client-writeoff.component";
import { BoosterBonusComponent } from "./booster-bonus.component";
import { BoosterWriteoffComponent } from "./booster-writeoff.component";
import { BoosterReportsComponent } from "./booster-reports.component";
import { TxsComponent } from "./txs.component";



const routes: Routes = [{
	path: 'txs',
	component: TxsComponent
},{
	path: 'txs/:tx',
	component: TxsComponent
},{
	path: 'client-refill',
	component: ClientRefillComponent
},{
	path: 'client-writeoff',
	component: ClientWriteoffComponent
},{
	path: 'booster-payoff',
	component: BoosterPayoffComponent
},{
	path: 'booster-reports',
	component: BoosterReportsComponent
},{
	path: 'booster-bonuses',
	component: BoosterBonusComponent
},{
	path: 'booster-writeoff',
	component: BoosterWriteoffComponent
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
