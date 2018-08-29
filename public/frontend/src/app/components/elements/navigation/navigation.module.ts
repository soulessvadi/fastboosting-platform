import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { I18nModule } from "../../i18n/i18n.module";
import { MinifyMenuComponent } from "./minify-menu.component";
import { NavigationComponent } from "./navigation.component";
import { SmartMenuDirective } from "./smart-menu.directive";
import { RouterModule } from "@angular/router";
import { ChatModule } from "../../chat/chat.module";
import { BigBreadcrumbsComponent } from "./big-breadcrumbs.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    ChatModule,
  ],
  declarations: [
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    BigBreadcrumbsComponent,
  ],
  exports: [
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    BigBreadcrumbsComponent,
  ]
})
export class NavigationModule{}
