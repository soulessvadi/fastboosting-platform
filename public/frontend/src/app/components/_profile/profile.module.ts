import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { RepliesComponent } from './replies.component';
import { NewsComponent } from './news.component';
import { SettingsComponent } from './settings.component';
import { ConfigureComponent } from './configure.component';
import { EventsComponent } from './events.component';
import { StatisticsComponent } from './statistics.component';
import { StatsModule } from '@app/shared/stats/stats.module';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { ModalModule } from 'ngx-bootstrap/modal';
import { HeroModalComponent } from './hero-modal.component';
import { LaneModalComponent } from './lane-modal.component';
import { PasswordModalComponent } from './password-modal.component';
import { ChartJsModule } from '@app/shared/graphs/chart-js/chart-js.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminWizardsModule } from '@app/shared/forms/wizards/smartadmin-wizards.module';

@NgModule({
  imports: [
    CommonModule,
    SmartadminLayoutModule,
    StatsModule,
    ProfileRoutingModule,
    BootstrapModule,
    FormsModule,
    ModalModule,
    SharedModule,
    ChartJsModule,
    SmartadminWizardsModule
  ],
  declarations: [ 
  	SettingsComponent, 
  	EventsComponent, 
  	StatisticsComponent,
    HeroModalComponent,
    LaneModalComponent,
    PasswordModalComponent,
    ConfigureComponent,
    NewsComponent,
    RepliesComponent,
  ]
})

export class ProfileModule {
}
