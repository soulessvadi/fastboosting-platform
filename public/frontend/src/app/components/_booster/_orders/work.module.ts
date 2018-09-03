import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './work-routing.module';
import { ListComponent } from './list.component';
import { HistoryComponent } from './history.component';
import { ActiveComponent } from './active.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StatsModule } from '@app/shared/stats/stats.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminWidgetsModule } from '@app/shared/widgets/smartadmin-widgets.module';
import { DatePipe } from '@angular/common';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SharedModule } from '../shared/shared.module';

import { BoostingComponent } from './active-orders/active-boosting.component';
import { CalibrationComponent } from './active-orders/active-calibration.component';
import { MedalComponent } from './active-orders/active-medal.component';
import { TrainingComponent } from './active-orders/active-training.component';

@NgModule({
  imports: [
    CommonModule,
    StatsModule,
    RoutingModule,
    FormsModule,
    ModalModule,
    SmartadminDatatableModule,
    SmartadminWidgetsModule,
    SharedModule,
    ChartJsModule,
  ],
  providers: [
    DatePipe
  ],
  declarations: [ 
  	ListComponent,
    HistoryComponent,
    ActiveComponent,
    BoostingComponent,
    CalibrationComponent,
    MedalComponent,
    TrainingComponent,
  ]
}) 

export class WorkModule {
}
