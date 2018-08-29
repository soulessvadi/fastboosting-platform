import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { HeaderModule } from "./header/header.module";
import { FooterComponent } from "./footer/footer.component";
import { NavigationModule } from "./navigation/navigation.module";
import { RibbonComponent } from "./ribbon/ribbon.component";
import { ShortcutComponent } from "./shortcut/shortcut.component";
import { LayoutSwitcherComponent } from "./layout-switcher.component";
import { MainLayoutComponent  } from './layouts/main-layout.component';
import { AdminLayoutComponent } from "./layouts/admin-layout.component";
import { AuthLayoutComponent  } from './layouts/auth-layout.component';
import { TooltipModule, BsDropdownModule } from "ngx-bootstrap";
import { RouteBreadcrumbsComponent  } from './ribbon/route-breadcrumbs.component';
import { PipesModule  } from '@app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    NavigationModule,
    FormsModule,
    RouterModule,
    TooltipModule,
    BsDropdownModule,
    PipesModule
  ],
  declarations: [
    FooterComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
    MainLayoutComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    RouteBreadcrumbsComponent,
  ],
  exports:[
    HeaderModule,
    NavigationModule,
    FooterComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
  ]
})

export class ElementsModule {}
