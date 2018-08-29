import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren:'./users/users.module#UsersModule',

  },
];

const Routing = RouterModule.forChild(routes);

@NgModule({
  imports: [
    SharedModule,
    Routing,
  ],
  declarations: [],
  providers: [],
})

export class MembersModule {}
