import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { I18nModule } from "@app/components/i18n/i18n.module";

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    I18nModule,
    FormsModule,
  ],
  exports: [],
  declarations: [RegisterComponent, TermsModalComponent]
})
export class RegisterModule { }
