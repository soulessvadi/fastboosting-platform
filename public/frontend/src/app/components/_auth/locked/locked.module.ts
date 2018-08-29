import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockedRoutingModule } from './locked-routing.module';
import { LockedComponent } from './locked.component';
import { I18nModule } from "@app/components/i18n/i18n.module";

@NgModule({
  imports: [
    CommonModule,
    LockedRoutingModule,
    I18nModule
  ],
  declarations: [LockedComponent]
})
export class LockedModule { }
