import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'payout-info-modal',
  templateUrl: './payout-info-modal.component.html',
})

export class PayoutModalComponent {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Input() request;

  constructor() {}
}
