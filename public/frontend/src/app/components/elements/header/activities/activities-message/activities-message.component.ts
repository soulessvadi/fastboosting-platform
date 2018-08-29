import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: '[activitiesMessages]',
  templateUrl: './activities-message.component.html',
})
export class ActivitiesMessageComponent implements OnInit {

  @Input() items: any;

  constructor() {}

  ngOnInit() {
  }

}
