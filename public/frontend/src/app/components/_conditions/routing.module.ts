import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionsComponent } from "./conditions.component";
import { BonusesComponent } from "./bonuses.component";
import { PricelistsComponent } from "./pricelists.component";

const routes: Routes = [{
	path: "",
	redirectTo: "agreements",
	pathMatch: "full"
},{
	path: 'agreements',
	component: ConditionsComponent
},{
	path: 'bonuses&penalties',
	component: BonusesComponent
},{
	path: 'pricelists',
	component: PricelistsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
