import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import * as moment from 'moment';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
})

export class StatisticsComponent implements OnInit {

  public balanceChart: any = { options: null, data: null };
  public ratingsChart: any = { options: null, data: null };
  public statistics: any = {};
  public topOrdersAmount: any = [];
  public topOrdersCount: any = [];  
  public balance_period: any = {from: null, till: null};
  public ratings_period: any = {from: null, till: null};
  public Math = Math;

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    this._service.getPartnersStatistics().subscribe(res => {
      this.statistics = res.body.statistics;
      this.topOrdersAmount = res.body.topOrdersAmount; 
      this.topOrdersCount = res.body.topOrdersCount; 
    });
  }
}
