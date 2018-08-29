import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import * as moment from 'moment';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
})

export class BalanceComponent implements OnInit {

  public chart: any = { options: {}, data: {} };
  public balance: any = {
    deposit: 0,
    balance: 0,
    earned: 0,
    deduced: 0,
  };
  public balance_period: any = {from: null, till: null};
  public Math = Math;

  constructor(public _service: ComponentService, public _router: Router) {

  }

  ngOnInit() {
    this._service.getSelfBalanceStatistics(this.balance_period).subscribe(res => {
      this.balance = res.body;
      if(this.balance.progress.length) {
        this.balance_period.from = moment.unix(this.balance.progress[0].timestamp).format('D.MM.YYYY');
        this.balance_period.till = moment.unix(this.balance.progress[this.balance.progress.length - 1].timestamp).format('D.MM.YYYY');
        this.renderChart();
      }
    });
  }

  private renderChart() {
    let self = this;
    let currency = self.balance.currency;
    let dates = [];
    let datasets = [];
    for(let x in self.balance.progress) {
      dates.push(moment.unix(self.balance.progress[x].timestamp).format('D.MM.YYYY'));
      datasets.push(self.balance.progress[x].amount);
    }

    self.chart.data = {
      labels: dates,
      datasets: [{
        data: datasets,
        backgroundColor: "rgba(132, 181, 71, 0.2)",
        borderColor: "rgba(132, 181, 71, 1)",
        pointBackgroundColor: "rgba(132, 181, 71, 1)"
      }]
    };

    self.chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: { 
        mode: 'nearest',
        displayColors: false,
        titleFontSize: 14,
        bodyFontSize: 12,
        callbacks: {
          afterLabel: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']] + ' ' + currency;
          },
          label: function(tooltipItem, data) {
            let index = tooltipItem['index'];
            let value = self.balance.progress[index].change;
            let sign = value == 0 ? '' : ( value < 0 ? '-' : '+' );
            return sign + Math.abs(self.balance.progress[index].change) + ' ' + currency;
          },
          labelTextColor:function(tooltipItem, chart){
            let index = tooltipItem['index'];
            let value = self.balance.progress[index].change;
            let color = value == 0 ? '#ffffff' : ( value < 0 ? '#fb3c4a' : '#84b547' );
            return color;
          }
        }
      },
      hover: { mode: 'dataset' },
      legend: { display: false },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            show: false,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            show: false,
            labelString: 'Data'
          }
        }]
      },
    };
  }
}
