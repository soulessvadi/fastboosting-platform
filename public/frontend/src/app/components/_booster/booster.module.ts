import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Router } from './booster.routing';
import { BalanceModule } from './_balance/balance.module';
import { WorkModule } from './_orders/work.module';
import { ConditionsModule } from './_conditions/conditions.module';
import { BoosterSupportModule } from './_support/support.module';
import { ProfileModule } from './_profile/profile.module';
import { BoosterComponent } from './booster.component';

@NgModule({
  imports: [
    Router,
    CommonModule,
    FormsModule,
    BoosterSupportModule,
    WorkModule,
    ConditionsModule,
    BalanceModule,
    ProfileModule,
  ],
  exports: [
  ],
  declarations: [ 
    BoosterComponent,
  ]
}) 

export class BoosterModule {

}
