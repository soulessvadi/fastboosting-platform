import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SharedModule } from "@app/components/_admin/shared/shared.module";
import { PricelistsComponent } from './pricelists.component';
import { NewsComponent } from './news.component';
import { NewsPostComponent } from './news-post.component';
import { BonusesComponent } from './bonuses.component';
import { SmartadminEditorsModule } from '@app/shared/forms/editors/smartadmin-editors.module';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    SmartadminInputModule,
    SmartadminEditorsModule,
    SharedModule
  ],
  declarations: [ 
    PricelistsComponent,
    NewsComponent,
    NewsPostComponent,
    BonusesComponent,
  ]
})

export class SettingsModule {
}
