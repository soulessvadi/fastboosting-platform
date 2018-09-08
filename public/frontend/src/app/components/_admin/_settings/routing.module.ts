import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricelistsComponent } from './pricelists.component';
import { BonusesComponent } from './bonuses.component';
import { NewsComponent } from './news.component';
import { NewsPostComponent } from './news-post.component';


const routes: Routes = [{
	path: 'news',
	component: NewsComponent
},{
	path: 'news/:id',
	component: NewsPostComponent
},{
	path: 'pricelists',
	component: PricelistsComponent
},{
	path: 'bonuses&penalties',
	component: BonusesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
