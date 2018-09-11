import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { ListComponent } from './list.component';
import { TicketComponent } from './list-ticket.component';
import { NewComponent } from './new.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    ModalModule,
    SharedModule,
  ],
  declarations: [ 
  	ListComponent, 
    NewComponent,
    TicketComponent,
  ]
})

export class SupportsModule {
}
