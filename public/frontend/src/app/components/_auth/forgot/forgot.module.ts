import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotComponent } from './forgot.component';
import { FormsModule } from '@angular/forms';
import { I18nModule } from "@app/components/i18n/i18n.module";

@NgModule({
  imports: [
    CommonModule,
    ForgotRoutingModule,
    FormsModule,
    I18nModule
  ],
  declarations: [ForgotComponent]
})
export class ForgotModule { }
