import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ElementsModule} from "@app/components/elements/layout.module";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [

  ],
  exports: [
    CommonModule,
    ElementsModule
  ]
})

export class ComponentsShareModule {}
