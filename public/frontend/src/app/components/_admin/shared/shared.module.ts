import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionModalComponent } from './admission-modal.component';
import { IssueModalComponent } from './issue-modal.component';
import { ReportModalComponent } from './report-modal.component';
import { ReportEditModalComponent } from './report-edit-modal.component';
import { PayoffModalComponent } from './payoff-modal.component';
import { HeroModalComponent } from './hero-modal.component';
import { LaneModalComponent } from './lane-modal.component';
import { TxModalComponent } from './tx-modal.component';
import { NewTxModalComponent } from './tx-new-modal.component';

import { GlobalShare } from '@app/global.share';

@NgModule({
  imports: [
    CommonModule,
    GlobalShare,
  ],
  exports: [
    AdmissionModalComponent,
    IssueModalComponent,
    ReportModalComponent,
    HeroModalComponent,
    LaneModalComponent,
    TxModalComponent,
    ReportEditModalComponent,
    PayoffModalComponent,
    NewTxModalComponent,
    GlobalShare,
  ],
  declarations: [ 
    AdmissionModalComponent,
    IssueModalComponent,
    ReportModalComponent,
    HeroModalComponent,
    LaneModalComponent,
    TxModalComponent,
    NewTxModalComponent,
    ReportEditModalComponent,
    PayoffModalComponent,
  ]
}) 

export class SharedModule {

}
