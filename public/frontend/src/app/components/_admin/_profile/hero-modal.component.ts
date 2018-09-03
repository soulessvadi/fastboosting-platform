import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'hero-modal',
  templateUrl: './hero-modal.component.html',
})

export class HeroModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() heroes = {};
  public _heroes = {};

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {

  }

  check(hero) {
  	this.changed.emit(hero);
  }

}
