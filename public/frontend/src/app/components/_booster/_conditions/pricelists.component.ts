import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'sa-bonuses',
  templateUrl: './pricelists.component.html',
})

export class PricelistsComponent implements OnInit {

  public pricelists = {
    boosting: null,
    medal_boost: null,
    calibration: null,
    training: null,
  };

  public currency = '';
  public boosting_price = '0.00';
  public medal_price = '0.00';
  public medal_from = 0;
  public medal_till = 0;
  public Math = Math;

  constructor(private _service: ComponentService) {}

  ngOnInit() {
    this._service.getSelfPricelists().subscribe(res => {
      this.pricelists = res.body;
      this.currency = this.pricelists.boosting[0].currency_name;
      this.medal_till = this.pricelists.medal_boost.length - 1;
      this.medal_price = this.medalPrice().toFixed(2);
    });
  }

  prevMedal(property) {
    if(property == 'from') { 
      if(this.pricelists.medal_boost[this.medal_from - 1])
        this.medal_from = this.medal_from - 1;
      else
        this.medal_from = this.pricelists.medal_boost.length - 1;
    } else { 
      if(this.pricelists.medal_boost[this.medal_till - 1])
        this.medal_till = this.medal_till - 1;
      else
        this.medal_till = this.pricelists.medal_boost.length - 1;
    }
    this.medal_price = this.medalPrice().toFixed(2);
  }

  nextMedal(property) {
    if(property == 'from') { 
      if(this.pricelists.medal_boost[this.medal_from + 1])
        this.medal_from = this.medal_from + 1;
      else
        this.medal_from = 0;
    } else { 
      if(this.pricelists.medal_boost[this.medal_till + 1])
        this.medal_till = this.medal_till + 1;
      else
        this.medal_till = 0;
    }
    this.medal_price = this.medalPrice().toFixed(2);
  }

  onSlide(data) {
    this.boosting_price = this.price(data.from, data.to).toFixed(2);
  }

  medalPrice(): number {
    let amount = 0;
    this.pricelists.medal_boost.forEach((e, i) => {
      if(i > this.medal_from && i <= this.medal_till && this.medal_from != this.medal_till) 
        amount += e.price;
    });
    return amount;
  }

  price(a, b): number {
    var start = parseInt(a);
    var end = parseInt(b);
    var amount = 0;
    this.pricelists.boosting.forEach((e, idx) => {
      if(this.inRange(start, e.from, e.till) && start <= end) {
          let in_range;
          if(end >= e.till)
            in_range = e.till - start;
          else 
            in_range = end - start;
          amount += in_range/e.volume*e.price;
          start += in_range;
      }
    });
    return amount;
  }

  inRange(x, a, b) {
    if(x >= a && x <= b) 
      return true;
    return false; 
  }

}
