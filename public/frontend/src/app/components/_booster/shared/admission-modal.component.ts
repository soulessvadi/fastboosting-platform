import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'admission-modal',
  templateUrl: './admission-modal.component.html',
})

export class AdmissionModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() order;

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    setTimeout(() => { this.close.emit(true) }, 10000)
  }
}
