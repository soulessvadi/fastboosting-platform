import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { ListComponent } from './list.component';
import { HistoryComponent } from './history.component';
import { ProblematicComponent } from './problematic.component';
import { ActiveComponent } from './active.component';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StatsModule } from '@app/shared/stats/stats.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminWidgetsModule } from '@app/shared/widgets/smartadmin-widgets.module';
import { DatePipe } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { BoostingComponent } from './active-orders/active-boosting.component';
import { CalibrationComponent } from './active-orders/active-calibration.component';
import { MedalComponent } from './active-orders/active-medal.component';
import { TrainingComponent } from './active-orders/active-training.component';
import { AdmissionModalComponent } from './admission-modal.component';
import { IssueModalComponent } from './issue-modal.component';
import { ReportModalComponent } from './report-modal.component';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { HeroModalComponent } from './hero-modal.component';
import { LaneModalComponent } from './lane-modal.component';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    SmartadminLayoutModule,
    StatsModule,
    OrdersRoutingModule,
    FormsModule,
    ModalModule,
    SmartadminDatatableModule,
    SmartadminWidgetsModule,
    SharedModule,
    ChartJsModule,
    SmartadminInputModule,
  ],
  providers: [
    DatePipe
  ],
  declarations: [ 
  	ListComponent,
    HistoryComponent,
    ActiveComponent,
    AdmissionModalComponent,
    IssueModalComponent,
    ReportModalComponent,
    HeroModalComponent,
    LaneModalComponent,
    BoostingComponent,
    CalibrationComponent,
    MedalComponent,
    TrainingComponent,
    ProblematicComponent,
  ]
}) 

export class OrdersModule {
}
