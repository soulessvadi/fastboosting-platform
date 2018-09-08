import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'tx-new-modal',
  templateUrl: './tx-new-modal.component.html',
})

export class NewTxModalComponent implements OnInit {

  @ViewChild('form') form;
  @ViewChild('message') message;
  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() type: any = 0;
  @Input() status: any = 0;
  @Input() user_id: any = 0;
  @Input() order_id: any = 0;
  @Input() currency_id: any = 0;
  public users = [];
  public user: any = {};
  public orders = [];
  public currencies = [];
  public statuses = [];
  public types = [];
  public tx = {
    amount: 0,
    user_id: 0,
    order_id: 0,
    currency_id: 1,
    type: 1,
    status: 1,
    comment: null,
  };
  public responseMessage: any = 'Загрузка';
  public responseSuccess: any = 'loading';

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    this._service.newTx().subscribe(res => {
      if(res.status == 200) {
        this.currencies = res.body.currencies;
        this.statuses = res.body.statuses;
        this.types = res.body.types;
        this.users = res.body.users;
        this.orders = res.body.orders;
        if(this.user_id) this.tx.user_id = this.user_id;
        if(parseInt(this.order_id) > 0) this.tx.order_id = this.order_id;
        if(parseInt(this.currency_id) > 0) this.tx.currency_id = this.currency_id;
        if(parseInt(this.type) > 0) this.tx.type = this.type;
        if(parseInt(this.status) > 0) this.tx.status = this.status;
        if(parseInt(this.user_id) > 0) {
          this.user = this.users.find(e => e.id = this.user_id);
          this.tx.user_id = this.user.id;
        }
        setTimeout(() => { this.responseMessage = null; }, 1000)
      } else {
        this.responseSuccess = false;
        this.responseMessage = 'Возникли неполадки. Попробуйте позже.';
      }      
    });
  }

  send() {
    this.responseSuccess = false;
    if(!this.tx.user_id) {
      this.responseMessage = 'Укажите владельца трансакции';
      setTimeout(() => {this.responseMessage = null}, 2000);
      return null;
    }
    if(!this.tx.amount) {
      this.responseMessage = 'Укажите сумму трансакции';
      setTimeout(() => {this.responseMessage = null}, 2000);
      return null;
    }
    if(!this.tx.status || !this.tx.type) {
      this.responseMessage = 'Тип и статус трансакции должны быть определены';
      setTimeout(() => {this.responseMessage = null}, 2000);
      return null;
    }
    this._service.addTx(this.tx).subscribe(res => {
      if(res.status == 200) { 
        this.responseMessage = 'Трансакция создана'; 
        this.responseSuccess = true;
        this.changed.emit(res.body);
        setTimeout(() => {
          this.close.emit(true);
        }, 1500);
      } else {
        this.responseMessage = 'Возникли неполадки. Попробуйте позже.';
        setTimeout(() => {
          this.responseMessage = null;
        }, 1500);
      }
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Возникли неполадки. Попробуйте позже.';            
      setTimeout(() => {
        this.responseMessage = null;
      }, 1500);
    });
  }

}
