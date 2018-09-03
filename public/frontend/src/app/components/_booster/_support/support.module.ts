import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ListComponent } from './list.component';
import { TicketComponent } from './list-ticket.component';
import { ContactsComponent } from './contacts.component';
import { NewComponent } from './new.component';
import { StatsModule } from '@app/shared/stats/stats.module';
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    StatsModule,
    RoutingModule,
    BootstrapModule,
    FormsModule,
    ModalModule,
    SharedModule,
    ChartJsModule,
  ],
  declarations: [ 
  	ListComponent, 
    NewComponent,
    ContactsComponent,
    TicketComponent,
  ]
})

export class BoosterSupportModule {
}
