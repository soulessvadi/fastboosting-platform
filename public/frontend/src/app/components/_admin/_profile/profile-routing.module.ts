import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from "./settings.component";
import { StatisticsComponent } from "./statistics.component";
import { EventsComponent } from "./events.component";
import { ConfigureComponent } from "./configure.component";

const routes: Routes = [{
	path: "",
	redirectTo: "settings",
	pathMatch: "full"
},{
	path: 'settings',
	component: SettingsComponent
},{
	path: 'statistics',
	component: StatisticsComponent
},{
	path: 'events',
	component: EventsComponent
},{
	path: 'events/:tab',
	component: EventsComponent
},{
	path: 'configure',
	component: ConfigureComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ProfileRoutingModule { }
