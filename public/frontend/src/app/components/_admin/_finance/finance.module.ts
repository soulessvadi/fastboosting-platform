import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { BoosterPayoffComponent } from './booster-payoff.component';
import { ClientRefillComponent } from "./client-refill.component";
import { ClientWriteoffComponent } from "./client-writeoff.component";
import { BoosterBonusComponent } from "./booster-bonus.component";
import { BoosterWriteoffComponent } from "./booster-writeoff.component";
import { BoosterReportsComponent } from "./booster-reports.component";
import { TxsComponent } from "./txs.component";


@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    BootstrapModule,
    FormsModule,
    ModalModule,
    SharedModule,
    ChartJsModule,
    SmartadminInputModule
  ],
  declarations: [ 
    ClientRefillComponent,
    ClientWriteoffComponent,
  	BoosterPayoffComponent, 
    BoosterBonusComponent,
    BoosterWriteoffComponent,
    BoosterReportsComponent,
    TxsComponent,
  ]
})

export class FinanceModule {}
