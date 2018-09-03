import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { PricelistsComponent } from './pricelists.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    SmartadminInputModule,
    SharedModule
  ],
  declarations: [ 
    PricelistsComponent,
  ]
})

export class SettingsModule {
}
