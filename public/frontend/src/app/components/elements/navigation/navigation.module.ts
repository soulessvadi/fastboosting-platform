import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MinifyMenuComponent } from "./minify-menu.component";
import { NavigationComponent } from "./navigation.component";
import { SmartMenuDirective } from "./smart-menu.directive";
import { ChatModule } from "../../chat/chat.module";
import { BigBreadcrumbsComponent } from "./big-breadcrumbs.component";
import { I18nModule } from "@app/components/i18n/i18n.module";

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
