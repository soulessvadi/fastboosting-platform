import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify.component';
import { I18nModule } from "@app/components/i18n/i18n.module";

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule,
    I18nModule
  ],
  declarations: [VerifyComponent]
})
export class VerifyModule { }
