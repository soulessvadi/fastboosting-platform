import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from "ngx-bootstrap";

import { PopoverModule } from "ngx-popover";
import { CollapseMenuComponent } from "./collapse-menu/collapse-menu.component";
import { RecentProjectsComponent } from "./recent-projects/recent-projects.component";
import { FullScreenComponent } from "./full-screen/full-screen.component";
import { ActivitiesComponent } from "./activities/activities.component";
import { ActivitiesMessageComponent } from "./activities/activities-message/activities-message.component";
import { ActivitiesNotificationComponent } from "./activities/activities-notification/activities-notification.component";
import { ActivitiesTaskComponent } from "./activities/activities-task/activities-task.component";
import { HeaderComponent } from "./header.component";
import { LogoutModule } from "@app/components/_auth/logout/logout.module";
import { I18nModule } from "@app/components/i18n/i18n.module";
import { UtilsModule } from "@app/shared/utils/utils.module";
import { PipesModule } from "@app/shared/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    UtilsModule,
    PipesModule, 
    LogoutModule, 
    PopoverModule,
    RouterModule,
    I18nModule,
  ],
  declarations: [
    ActivitiesMessageComponent,
    ActivitiesNotificationComponent,
    ActivitiesTaskComponent,
    RecentProjectsComponent,
    FullScreenComponent,
    CollapseMenuComponent,
    ActivitiesComponent,
    HeaderComponent,
  ],
  exports: [
    I18nModule,
    HeaderComponent
  ]
})
export class HeaderModule{}
