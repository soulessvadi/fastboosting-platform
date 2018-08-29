import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: UsersComponent,
  data: {pageTitle: 'Social'}
}];

const SocialRoutingModule = RouterModule.forChild(routes);

@NgModule({
  imports: [
    CommonModule,
    SocialRoutingModule
  ],
  declarations: [
  	UsersComponent
  ]
})

export class UsersModule { }
