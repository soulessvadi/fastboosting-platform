import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { Error404Component } from './error404.component';
import { TranslationsComponent } from './translations.component';


const routes: Routes = [{
	path: '404',
	component: Error404Component
},{
	path: 'contacts',
	component: ContactsComponent
},{
	path: 'translations',
	component: TranslationsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RoutingModule { }
