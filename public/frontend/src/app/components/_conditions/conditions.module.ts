import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ConditionsComponent } from './conditions.component';
import { BonusesComponent } from './bonuses.component';
import { PricelistsComponent } from './pricelists.component';
import { StatsModule } from '@app/shared/stats/stats.module';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminWizardsModule } from '@app/shared/forms/wizards/smartadmin-wizards.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

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
    SmartadminWizardsModule,
    SmartadminInputModule
  ],
  declarations: [ 
  	ConditionsComponent, 
    BonusesComponent,
    PricelistsComponent,
  ]
})

export class ConditionsModule {
}
