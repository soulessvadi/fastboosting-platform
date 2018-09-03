import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { NotificationService } from '@app/core/services';

@Component({
  selector: 'active-order',
  templateUrl: './active.component.html',
})

export class ActiveComponent implements OnInit {
  public order: any = null;
  public properties: any = {
    types     : [],
    lanes     : [],
    servers   : [],
    ranks     : [],
    services  : [],
  };

  constructor(
    public _service: ComponentService, 
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this._service._active_order.then((res: any) => {
      if(res.error && res.error == 'no_active_order_reference') {
        let user = this._service._user;
        user.is_busy = false;
        this._service._user = user;
        this.router.navigate(['/orders/pending']);
      } else {
        this.order               = res;
        this.properties.lanes    = this._service.lanes;
        this.properties.types    = this._service.orders_types;
        this.properties.servers  = this._service.servers;
        this.properties.ranks    = this._service.ranks;
        this.properties.services = this._service.services;
      }
    }).catch(e => {})
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
