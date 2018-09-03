import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'pricelists-edit',
  templateUrl: './pricelists.component.html',
})

export class PricelistsComponent implements OnInit {
  public activeTab = 0;
  public Math = Math;
  public responseMessage = null;
  public responseSuccess = false;
  public loading = false;

  public categories = null;
  public factor = 1;
  public pricelists = {
    boosting: null,
    medal_boost: null,
    calibration: null,
    training: null,
  };
  public boosting_prices: any[] = [{v:'0.00',c:'₽'},{v:'0.00',c:'$'}];
  public medal_price: any[] = [{v:'0.00',c:'₽'},{v:'0.00',c:'$'}];
  public medal_from = 0;
  public medal_till = 1;
  public cat_calc = {
    factor: 1,
    price: 500,
  };


  constructor(
    public _service: ComponentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetch();
  }

  public fetch() {
    this._service.getPricelists().subscribe(res => {
      this.pricelists.boosting = res.body.boosting || null;
      this.pricelists.medal_boost = res.body.medal_boost || null;
      this.pricelists.calibration = res.body.calibration || null;
      this.pricelists.training = res.body.training || null;
      this.medal_price = this.medalPrice();
      this.categories = res.body.categories;
    });
  }

  public catReorder() {
    this.categories = this.categories.sort((a,b) => a.id > b.id ? 1 : -1);
  }

  public catAdd() {
    this.categories.unshift({id:1,from:0,till:0,factor:0,name:null});
  }

  public catRemove(item) {
    this.categories = this.categories.filter((a) => a != item);
  }

  public catSave() {
    this.loading = true; 
    this._service.savePricelistCategories(this.categories).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }

  public medalPrice(): any[] {
    let amountrub = 0;
    let amountusd = 0;
    this.pricelists.medal_boost.forEach((e, i) => {
      if(i >= this.medal_from && i < this.medal_till && this.medal_from != this.medal_till) {
        console.log(i, e.rub, e.usd)
        amountrub += e.rub; amountusd += e.usd;
      }
    });
    return this.medal_price = [{v:amountrub,c:'₽'},{v:amountusd,c:'$'}];
  }

  public medalSave() {
    this.loading = true; 
    this._service.saveMedalPricelist(this.pricelists.medal_boost).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }

  public onSlide(data) {
    this.boosting_prices = this.boostPrices(data.from, data.to);
  }

  public boostingReorder() {
    this.pricelists.boosting = this.pricelists.boosting.sort((a,b) => a.id > b.id ? 1 : -1);
  }

  public boostingAdd() {
    this.pricelists.boosting.unshift({id:1,from:0,till:0,rub:0,usd:0,volume:0});
  }

  public boostingRemove(item) {
    this.pricelists.boosting = this.pricelists.boosting.filter((a) => a != item);
  }

  public boostingSave() {
    this.loading = true; 
    this._service.saveBoostPricelist(this.pricelists.boosting).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }

  boostPrices(a, b): any[] {
    var start = parseInt(a) || 0;
    var end = parseInt(b) || 0;
    var amountrub: any = 0;
    var amountusd: any = 0;
    this.pricelists.boosting.forEach((e, idx) => {
      if(this.inRange(start, e.from, e.till) && start <= end) {
        let in_range;
        if(end >= e.till)
          in_range = e.till - start;
        else 
          in_range = end - start;
        amountrub += in_range/e.volume*e.rub;
        amountusd += in_range/e.volume*e.usd;
        start += in_range;
      }
    });
    return [{v:amountrub,c:'₽'},{v:amountusd,c:'$'}];
  }

  inRange(x, a, b) {
    if(x >= a && x <= b) 
      return true;
    return false; 
  }

}
