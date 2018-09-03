import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SmartadminWizardsModule } from '@app/shared/forms/wizards/smartadmin-wizards.module';
import { SharedModule } from '../shared/shared.module';

import { RepliesComponent } from './replies.component';
import { NewsComponent } from './news.component';
import { PasswordModalComponent } from './password-modal.component';
import { SettingsComponent } from './settings.component';
import { ConfigureComponent } from './configure.component';
import { EventsComponent } from './events.component';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    SharedModule,
    ChartJsModule,
    SmartadminWizardsModule
  ],
  declarations: [ 
  	SettingsComponent, 
  	EventsComponent, 
  	StatisticsComponent,
    PasswordModalComponent,
    ConfigureComponent,
    NewsComponent,
    RepliesComponent,
  ]
})

export class ProfileModule {
}
