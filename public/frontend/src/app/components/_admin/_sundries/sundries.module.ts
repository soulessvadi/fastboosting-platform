import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ContactsComponent } from './contacts.component';
import { TranslationsComponent } from './translations.component';
import { Error404Component } from './error404.component';
import { StatsModule } from '@app/shared/stats/stats.module';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { BootstrapModule } from "@app/shared/bootstrap.module";

@NgModule({
  imports: [
    CommonModule,
    SmartadminLayoutModule,
    StatsModule,
    RoutingModule,
    BootstrapModule,
    FormsModule,
  ],
  declarations: [ 
    ContactsComponent,
    Error404Component,
    TranslationsComponent
  ]
})

export class SundriesModule {
}
