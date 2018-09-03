import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ElementsModule} from "@app/components/elements";
import {BootstrapModule} from "@app/shared/bootstrap.module";
import {UtilsModule} from "@app/shared/utils/utils.module";
import {PipesModule} from "@app/shared/pipes/pipes.module";
import {ChatModule} from "@app/shared/chat/chat.module";
import {InlineGraphsModule} from "@app/shared/graphs/inline/inline-graphs.module";
import {SmartProgressbarModule} from "@app/shared/ui/smart-progressbar/smart-progressbar.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ElementsModule,
    BootstrapModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ElementsModule,
    BootstrapModule,
    UtilsModule,
    PipesModule,
    SmartProgressbarModule,
    InlineGraphsModule,
    ChatModule,
  ]
})

export class GlobalShare {}