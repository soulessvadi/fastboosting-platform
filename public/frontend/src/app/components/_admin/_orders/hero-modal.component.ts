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
  @Input() title = '';
  @Input() heroes = [];
  @Input() selected = [];

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {

  }

  check(hero, $event) {
    hero.checked = $event.target.checked ? true : false;
  	this.changed.emit(hero);
  }

}
