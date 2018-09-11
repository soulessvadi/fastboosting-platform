import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Router } from './admin.routing';
import { BoostersModule } from './_users/boosters/boosters.module';
import { OrdersModule } from './_orders/orders.module';
import { ClientsModule } from './_users/clients/clients.module';
import { SettingsModule } from './_settings/settings.module';
import { SupportsModule } from './_support/supports.module';
import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    Router,
    CommonModule,
    FormsModule,
    BoostersModule,
    OrdersModule,
    SettingsModule,
    SupportsModule,
    ClientsModule,
  ],
  exports: [
  ],
  declarations: [ 
    AdminComponent,
  ]
}) 

export class AdminModule {

}
