import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { StatsModule } from '@app/shared/stats/stats.module';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SharedModule } from '../shared/shared.module';
import { TxComponent } from './tx.component';
import { WithdrawalComponent } from './withdrawal.component';
import { PayoutModalComponent } from './payout-info-modal.component';
import { BalanceComponent } from './balance.component';

@NgModule({
  imports: [
    CommonModule,
    StatsModule,
    RoutingModule,
    FormsModule,
    SharedModule,
    ChartJsModule,
  ],
  declarations: [ 
    TxComponent,
    WithdrawalComponent,
    BalanceComponent,
    PayoutModalComponent,
  ]
})

export class BalanceModule {
}
