import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { NotificationService } from '@app/core/services';

@Component({
  selector: 'active-order',
  templateUrl: './active.component.html',
})

export class ActiveComponent implements OnInit {
  public order_number: string = null;
  public order: any = null;
  public properties: any = {
    types     : [],
    lanes     : [],
    servers   : [],
    ranks     : [],
    services  : [],
    statuses  : [],
  };

  constructor(
    public _service: ComponentService, 
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.order_number = this.route.snapshot.paramMap.get('number');
    this._service.getOrderByNumber(this.order_number).subscribe((res: any) => {
      if(res.error && res.error == 'order_not_found') {
        this.router.navigate(['/404']);
      } else {
        this.order               = res.body.order;
        this.properties.partners = res.body.partners;
        this.properties.users    = res.body.users;
        this.properties.types    = res.body.types;
        this.properties.ranks    = res.body.ranks;
        this.properties.services = res.body.services;
        this.properties.statuses = res.body.statuses;
        this.properties.cali = res.body.cali;
      }
    }, (err) => {
      this.router.navigate(['/404']);
    });
  }

  public reportSaved(response) {
    if(response.log) {
      this.order.logs.unshift(response.log);
    }
    if(response.report) {
      this.order.reports.unshift(response.report);
    }
  }

  public setOrderDotabuff($event) {
    if(this.order.dotabuff.length < 2) return;
    $event.target.classList.add('loading');
    this._service.setOrderDotabuff({link:this.order.dotabuff}).subscribe(res => {
      setTimeout(() => { $event.target.classList.remove('loading'); }, 500)
    });
  }

  public changeStatus() {
    this._service.setWorkerStatus({status:this.order.worker_status}).subscribe();
  }

  public quitOrder() {
    this.notificationService.smartMessageBox({
      title: `<strong class='txt-color-blue'>${this._service.user.nick_name}</strong> вы действительно хотите отменить заказ?`,
      content: "Важно! Отмененный заказ не будет оплачен и негативно повлияет на ваш рейтинг.",
      buttons: "[Нет][Да]",
    }, (button, comment) => {
      if(button == "Нет") return 0;
      this._service.cancelOrder().subscribe(res => {
        if(res.status == 200) {
          let user = this._service._user;
          user.is_busy = false;
          this._service._user = user;
          this.router.navigate(['/orders/pending']);
        } else {
          if(res.error == 'order_not_available') {
            // notificate
          }
        }
      });
    });
  }
}
