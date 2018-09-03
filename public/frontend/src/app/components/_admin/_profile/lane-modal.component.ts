import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'lane-modal',
  templateUrl: './lane-modal.component.html',
})

export class LaneModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() lanes = {};
  public _heroes = {};

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {

  }

  check(lane) {
  	this.changed.emit(lane);
  }

}
