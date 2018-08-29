import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { TxComponent } from './tx.component';
import { WithdrawalComponent } from './withdrawal.component';
import { IssueModalComponent } from './issue-modal.component';
import { PayoutModalComponent } from './payout-info-modal.component';
import { BalanceComponent } from './balance.component';
import { StatsModule } from '@app/shared/stats/stats.module';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminWizardsModule } from '@app/shared/forms/wizards/smartadmin-wizards.module';

@NgModule({
  imports: [
    CommonModule,
    SmartadminLayoutModule,
    StatsModule,
    RoutingModule,
    BootstrapModule,
    FormsModule,
    ModalModule,
    SharedModule,
    ChartJsModule,
    SmartadminWizardsModule
  ],
  declarations: [ 
    TxComponent,
    WithdrawalComponent,
    BalanceComponent,
    IssueModalComponent,
    PayoutModalComponent,
  ]
})

export class BalanceModule {
}
