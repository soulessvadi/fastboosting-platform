import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: '[activitiesReminders]',
  templateUrl: './activities-task.component.html',
})
export class ActivitiesTaskComponent implements OnInit {

  @Input() items: any;
  @Input() lastUpdate: any;

  constructor() {}

  ngOnInit() {
  }

  setProgressClasses() {
    return {
      'progress-bar': true,
      'progress-bar-success': this.items.status == 'MINOR' || this.items.status == 'NORMAL',
      'bg-color-teal': this.items.status == 'PRIMARY' || this.items.status == 'URGENT',
      'progress-bar-danger': this.items.status == 'CRITICAL'
    };
  }
}
