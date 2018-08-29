import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: '[activitiesNews]',
  templateUrl: './activities-notification.component.html',
})
export class ActivitiesNotificationComponent implements OnInit {

  @Input() items: any;

  constructor() {}

  ngOnInit() {
  }

  setClasses() {
    let classes = {  'fa fa-fw fa-2x':true };
    classes[this.items.icon] = true;
    return classes
  }

}
