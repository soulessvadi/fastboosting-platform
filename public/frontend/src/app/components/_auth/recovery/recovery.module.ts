import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecoveryRoutingModule } from './recovery-routing.module';
import { RecoveryComponent } from './recovery.component';
import { I18nModule } from "@app/components/i18n/i18n.module";

@NgModule({
  imports: [
    CommonModule,
    RecoveryRoutingModule,
    I18nModule,
    FormsModule
  ],
  declarations: [RecoveryComponent]
})
export class RecoveryModule { }
