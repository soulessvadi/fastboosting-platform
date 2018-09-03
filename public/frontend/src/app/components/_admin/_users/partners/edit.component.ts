import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'user-edit',
  templateUrl: './edit.component.html',
})

export class EditComponent implements OnInit, OnDestroy {
  @ViewChild('avatarimg') avatarimg;
  public loading: boolean = false;
  public avatarUpload = null;
  public orders: any = [];
  public txs: any = [];
  public ordersShown: any = [];
  public txsShown: any = [];
  public countries: any = [];
  public currencies: any = [];
  public languages: any = [];
  public user_id: number;
  public user: any = null;
  public activeTab = 0;
  public responseMessage = null;
  public responseSuccess = false;
  public Math = Math;
  public pricelists = {
    boost: null,
    medal: null,
  };
  public boosting_price:number = 0;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user_id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.fetch();
  }

  ngOnDestroy() { }

  public save() {
    this.loading = true;
    let data = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
    for(let prop in this.user) data.set(prop, this.user[prop]);
    this._service.savePartner(this.user.id, data).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }

  public fetch() {
    this._service.getPartner(this.user_id).subscribe((res: any) => {
      this.user = res.body.info;
      this.orders = res.body.orders;
      this.txs = res.body.txs;
      this.countries = res.body.countries;
      this.currencies = res.body.currencies;
      this.languages = res.body.languages;
      this.pricelists.boost = res.body.pricelist_boost;
      this.loadMoreOrders();
      this.loadMoreTxs();
      if(!this.user) this.router.navigate(['/govt/sundry/404']);
    })
  }

  public loadMoreOrders() {
    this.ordersShown = this.ordersShown.concat(this.orders.slice(0, 10));
    this.orders.splice(0, 10);
  }
  public loadMoreTxs() {
    this.txsShown = this.txsShown.concat(this.txs.slice(0, 10));
    this.txs.splice(0, 10);
  }

  public generateApiKey() {
    this._service.generateApiKey().subscribe((res: any) => {
      if(res.status == 200) this.user.login = res.body.key;
    });
  }

  public onimgloaded(event) : void {
    var path = event.target.value.split('\\');
    var filename = path.pop();
    var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null;
    if(['jpeg','jpg','gif','png'].indexOf(ext) === -1) {
      return event.target.value = null;
    }
    var files: any = event.target.files;
    var formData: any = new FormData();
    formData.set("files", files[0], files[0]['name']);
    this.avatarUpload = formData;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e:any) => { this.avatarimg.nativeElement.src = e.target.result; }
    reader.readAsDataURL(file);
  }

  public boostingReorder() {
    this.pricelists.boost = this.pricelists.boost.sort((a,b) => a.id > b.id ? 1 : -1);
  }

  public boostingAdd() {
    this.pricelists.boost.unshift({id:1,from:0,till:0,rub:0,usd:0,volume:0});
  }

  public boostingRemove(item) {
    this.pricelists.boost = this.pricelists.boost.filter((a) => a != item);
  }

  public boostingSave() {
    this.loading = true; 
    this._service.savePartnerBoostPricelist(this.user.id, this.pricelists.boost).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }

  public onSlide(data) {
    this.boosting_price = this.boostPrices(data.from, data.to);
  }

  public boostPrices(a, b): number {
    var start = parseInt(a) || 0;
    var end = parseInt(b) || 0;
    var amountrub: any = 0;
    var amountusd: any = 0;
    this.pricelists.boost.forEach((e, idx) => {
      if(this.inRange(start, e.from, e.till) && start <= end) {
        let in_range;
        if(end >= e.till)
          in_range = e.till - start;
        else 
          in_range = end - start;
        amountrub += in_range/e.volume*e.rub;
        start += in_range;
      }
    });
    console.log(amountrub);
    return amountrub;
  }

  inRange(x, a, b) {
    if(x >= a && x <= b) 
      return true;
    return false; 
  }
}
