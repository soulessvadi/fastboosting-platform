import {Component, OnInit} from '@angular/core';
import {ComponentService} from "@app/components/components.service";

@Component({
  selector: 'sa-recent-projects',
  templateUrl: './recent-projects.component.html',
})
export class RecentProjectsComponent implements OnInit {

  constructor(public _service: ComponentService) {
      
  }

  ngOnInit() {
  }

  clearProjects() {}

}
