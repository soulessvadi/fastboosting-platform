import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TxComponent } from "./tx.component";
import { WithdrawalComponent } from './withdrawal.component';
import { BalanceComponent } from './balance.component';


const routes: Routes = [{
	path: "",
	redirectTo: "info",
	pathMatch: "full"
},{
	path: 'txs',
	component: TxComponent
},{
	path: 'txs/:tx',
	component: TxComponent
},{
	path: 'withdrawal',
	component: WithdrawalComponent
},{
	path: 'info',
	component: BalanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
