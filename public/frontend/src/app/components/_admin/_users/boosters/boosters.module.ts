import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { ListComponent } from './list.component';
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';
import { StatisticsComponent } from "./statistics.component";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    ChartJsModule,
    SmartadminInputModule,
    SharedModule
  ],
  declarations: [ 
  	ListComponent, 
    NewComponent,
    EditComponent,
    StatisticsComponent,
  ]
})

export class BoostersModule {
}
