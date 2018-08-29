import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { I18nModule } from "@app/components/i18n/i18n.module";

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    I18nModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
