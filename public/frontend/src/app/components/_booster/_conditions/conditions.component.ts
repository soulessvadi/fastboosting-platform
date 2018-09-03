import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sa-profile',
  templateUrl: './conditions.component.html',
})

export class ConditionsComponent implements OnInit {

  public chartjsData;

  constructor() {}

  ngOnInit() {
      this.chartjsData = {
        "labels": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
        "datasets": [
          {
            "label": "MMR заслужено",
            "backgroundColor": "rgba(220,220,220,0.5)",
            "borderColor": "rgba(220,220,220,0.8)",
            "hoverBackgroundColor": "rgba(220,220,220,0.75)",
            "hoverBorderColor": "rgba(220,220,220,1)",
            "data": [5200, 4530, 3200, 3925, 4125, 5050]
          },
          {
            "label": "Заказов выполнено",
            "backgroundColor": "rgba(220,220,220,0.5)",
            "borderColor": "rgba(220,220,220,0.8)",
            "hoverBackgroundColor": "rgba(220,220,220,0.75)",
            "hoverBorderColor": "rgba(220,220,220,1)",
            "data": [2, 3, 3, 1, 3, 2]
          },
          {
            "label": "Средств заработано",
            "backgroundColor": "rgba(151,187,205,0.5)",
            "borderColor": "rgba(151,187,205,0.8)",
            "hoverBackgroundColor": "rgba(151,187,205,0.75)",
            "hoverBorderColor": "rgba(151,187,205,1)",
            "data": [45.000, 39.000, 30.000, 36.200, 38.000, 43.500]
          }

        ]
      };
  }

}
