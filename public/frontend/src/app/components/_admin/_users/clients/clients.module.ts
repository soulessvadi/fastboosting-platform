import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RoutingModule } from './routing.module';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { AllUsersComponent } from './allusers.component';
import { AllUsersEditComponent } from './allusers-edit.component';
import { ListComponent } from './list.component';
import { PrivComponent } from './priv.component';
import { PrivEditComponent } from './priv-edit.component';
import { PrivNewComponent } from './priv-new.component';
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';


@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    ModalModule,
    SharedModule,
    ChartJsModule,
    SmartadminInputModule
  ],
  declarations: [ 
  	ListComponent, 
    NewComponent,
    EditComponent,
    PrivComponent,
    PrivEditComponent,
    PrivNewComponent,
    AllUsersComponent,
    AllUsersEditComponent,
  ]
})

export class ClientsModule {
}
