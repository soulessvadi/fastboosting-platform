import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SmartadminWidgetsModule } from '@app/shared/widgets/smartadmin-widgets.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { OrdersRoutingModule } from './orders.routing';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { ListComponent } from './list.component';
import { HistoryComponent } from './history.component';
import { ProblematicComponent } from './problematic.component';
import { ActiveComponent } from './active.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BoostingComponent } from './active-orders/active-boosting.component';
import { CalibrationComponent } from './active-orders/active-calibration.component';
import { MedalComponent } from './active-orders/active-medal.component';
import { TrainingComponent } from './active-orders/active-training.component';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    ModalModule,
    SmartadminDatatableModule,
    SmartadminWidgetsModule,
    ChartJsModule,
    SmartadminInputModule,
    SharedModule,
  ],
  providers: [],
  declarations: [ 
  	ListComponent,
    HistoryComponent,
    ActiveComponent,
    BoostingComponent,
    CalibrationComponent,
    MedalComponent,
    TrainingComponent,
    ProblematicComponent,
  ]
}) 

export class OrdersModule {
}
