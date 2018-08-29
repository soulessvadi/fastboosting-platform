import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from "./logout.component";

@NgModule({
  imports: [CommonModule],
  declarations: [LogoutComponent],
  exports: [LogoutComponent]
})

export class LogoutModule { }
