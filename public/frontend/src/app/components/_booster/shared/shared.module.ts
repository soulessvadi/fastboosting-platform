import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionModalComponent } from './admission-modal.component';
import { IssueModalComponent } from './issue-modal.component';
import { TxIssueModalComponent } from './tx-issue-modal.component';
import { ReportModalComponent } from './report-modal.component';
import { ReportEditModalComponent } from './report-edit-modal.component';
import { PayoffModalComponent } from './payoff-modal.component';
import { HeroModalComponent } from './hero-modal.component';
import { LaneModalComponent } from './lane-modal.component';
import { TxModalComponent } from './tx-modal.component';
import { GlobalShare } from '@app/global.share';

@NgModule({
  imports: [
    CommonModule,
    GlobalShare,
  ],
  exports: [
    AdmissionModalComponent,
    IssueModalComponent,
    TxIssueModalComponent,
    ReportModalComponent,
    HeroModalComponent,
    LaneModalComponent,
    TxModalComponent,
    ReportEditModalComponent,
    PayoffModalComponent,
    GlobalShare,
  ],
  declarations: [ 
    AdmissionModalComponent,
    IssueModalComponent,
    TxIssueModalComponent,
    ReportModalComponent,
    HeroModalComponent,
    LaneModalComponent,
    TxModalComponent,
    ReportEditModalComponent,
    PayoffModalComponent,
  ]
}) 

export class SharedModule {

}
