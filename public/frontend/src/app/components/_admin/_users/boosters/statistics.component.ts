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
  public boostersActive: any = [];
  public boostersFree: any = [];
  public ratings: any = {
    orders_finished: 0,
    orders_total: 0,
    mmr_volume: 0,
    average_rank: 0,
    reviews_mark: 0,
    reviews_total: 0,
    current_rank: 0,
  };  
  public balance_period: any = {from: null, till: null};
  public ratings_period: any = {from: null, till: null};
  public Math = Math;

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    this._service.getBoostersStatistics().subscribe(res => {
      this.statistics = res.body.statistics;
      this.boostersActive = res.body.active; 
      this.boostersFree = res.body.free; 
      // if(this.balance.progress.length) {
      //   this.balance_period.from = moment.unix(this.balance.progress[0].timestamp).format('D.MM.YYYY');
      //   this.balance_period.till = moment.unix(this.balance.progress[this.balance.progress.length - 1].timestamp).format('D.MM.YYYY');
      //   this.ratings_period.from = moment.unix(this.ratings.progress[0].timestamp).format('D.MM.YYYY');
      //   this.ratings_period.till = moment.unix(this.ratings.progress[this.ratings.progress.length - 1].timestamp).format('D.MM.YYYY');
      //   this.renderCharts();
      // }
    });
  }

  // private renderCharts() {
  //   let self = this;
  //   let currency = self.balance.currency;

  //   (() => {
  //     let dates = [];
  //     let datasets = [];

  //     for(let x in self.balance.progress) {
  //       dates.push(moment.unix(self.balance.progress[x].timestamp).format('D.MM.YYYY'));
  //       datasets.push(self.balance.progress[x].amount);
  //     }
  //     self.balanceChart.data = {
  //       labels: dates,
  //       datasets: [{
  //         data: datasets,
  //         backgroundColor: "rgba(132, 181, 71, 0.2)",
  //         borderColor: "rgba(132, 181, 71, 1)",
  //         pointBackgroundColor: "rgba(132, 181, 71, 1)"
  //       }]
  //     };
  //   })();

  //   (() => {
  //     let dates = [];
  //     let datasets = [];
  //     for(let x in self.ratings.progress) {
  //       dates.push(moment.unix(self.ratings.progress[x].timestamp).format('D.MM.YYYY'));
  //       datasets.push(self.ratings.progress[x].rating);
  //     }
  //     self.ratingsChart.data = {
  //       labels: dates,
  //       datasets: [{
  //         data: datasets,
  //         backgroundColor: "rgba(132, 181, 71, 0.2)",
  //         borderColor: "rgba(132, 181, 71, 1)",
  //         pointBackgroundColor: "rgba(132, 181, 71, 1)"
  //       }]
  //     }; 
  //   })();   

  //   self.balanceChart.options = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     tooltips: { 
  //       mode: 'nearest',
  //       displayColors: false,
  //       titleFontSize: 14,
  //       bodyFontSize: 12,
  //       callbacks: {
  //         afterLabel: function(tooltipItem, data) {
  //           return data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']] + ' ' + currency;
  //         },
  //         label: function(tooltipItem, data) {
  //           let index = tooltipItem['index'];
  //           let value = self.balance.progress[index].change;
  //           let sign = value == 0 ? '' : ( value < 0 ? '-' : '+' );
  //           return sign + Math.abs(self.balance.progress[index].change) + ' ' + currency;
  //         },
  //         labelTextColor:function(tooltipItem, chart){
  //           let index = tooltipItem['index'];
  //           let value = self.balance.progress[index].change;
  //           let color = value == 0 ? '#ffffff' : ( value < 0 ? '#fb3c4a' : '#84b547' );
  //           return color;
  //         }
  //       }
  //     },
  //     hover: { mode: 'dataset' },
  //     legend: { display: false },
  //     scales: {
  //       xAxes: [{
  //         display: true,
  //         scaleLabel: {
  //           show: false,
  //           labelString: 'Date'
  //         }
  //       }],
  //       yAxes: [{
  //         display: true,
  //         scaleLabel: {
  //           show: false,
  //           labelString: 'Data'
  //         }
  //       }]
  //     },
  //   };

  //   self.ratingsChart.options = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     tooltips: { 
  //       mode: 'nearest',
  //       displayColors: false,
  //       titleFontSize: 14,
  //       bodyFontSize: 12,
  //     },
  //     hover: { mode: 'dataset' },
  //     legend: { display: false },
  //     scales: {
  //       xAxes: [{
  //         display: true,
  //         scaleLabel: {
  //           show: false,
  //           labelString: 'Date'
  //         }
  //       }],
  //       yAxes: [{
  //         display: true,
  //         scaleLabel: {
  //           show: false,
  //           labelString: 'Data'
  //         }
  //       }]
  //     },
  //   };
  // }
}
