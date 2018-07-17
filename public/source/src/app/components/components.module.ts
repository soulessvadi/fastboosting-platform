import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SmartadminLayoutModule } from "./layout";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SmartadminLayoutModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SmartadminLayoutModule,
  ]
})

export class ComponentsModule {}
