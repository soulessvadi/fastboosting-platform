import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ContactsComponent } from './contacts.component';
import { TranslationsComponent } from './translations.component';
import { Error404Component } from './error404.component';
import { SharedModule } from "@app/components/_admin/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [ 
    ContactsComponent,
    Error404Component,
    TranslationsComponent
  ]
})

export class SundriesModule {
}
