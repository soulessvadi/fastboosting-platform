import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
})

export class EventsComponent implements OnInit {

  public activeTab = 1;
  public news: any = {};
  public tickets: any = {};
  public alerts: any = {};


  constructor(public _service: ComponentService, private route: ActivatedRoute) {
  	this._service.getSelfEvents().subscribe(res => {
  		this.news = res.body.posts;
  		this.tickets = res.body.tickets;
  		this.alerts = res.body.alerts;
  	});
  }

  ngOnInit() {
    let tab = this.route.snapshot.paramMap.get('tab');
    if(tab == 'news') this.activeTab = 1;
    if(tab == 'notifications') this.activeTab = 3;
  }

}
