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
  @Input() title = '';
  @Input() lanes: any = {};
  @Input() selected = [];

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    if(!this.lanes) {
      this._service._lanes.then(res => {
        this.lanes = res;
      })
    }
  }

  check(lane, $event) {
    lane.checked = $event.target.checked ? true : false;
  	this.changed.emit(lane);
  }

}
