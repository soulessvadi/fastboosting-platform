import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TooltipModule, BsDropdownModule } from "ngx-bootstrap";

import { HeaderModule } from "./header/header.module";
import { FooterComponent } from "./footer/footer.component";
import { NavigationModule } from "./navigation/navigation.module";
import { RibbonComponent } from "./ribbon/ribbon.component";
import { LayoutSwitcherComponent } from "./layout-switcher.component";
import { MainLayoutComponent  } from './layouts/main-layout.component';
import { AdminLayoutComponent } from "./layouts/admin-layout.component";
import { EmptyLayoutComponent } from "./layouts/empty-layout.component";
import { AuthLayoutComponent  } from './layouts/auth-layout.component';
import { RouteBreadcrumbsComponent  } from './ribbon/route-breadcrumbs.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';

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
    LayoutSwitcherComponent,
    MainLayoutComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    EmptyLayoutComponent,
    RouteBreadcrumbsComponent,
  ],
  exports:[
    FormsModule,
    HeaderModule,
    NavigationModule,
    FooterComponent,
    RibbonComponent,
    LayoutSwitcherComponent,
  ]
})

export class ElementsModule {}

