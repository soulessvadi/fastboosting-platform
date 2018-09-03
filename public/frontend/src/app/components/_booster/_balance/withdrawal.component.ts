import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
})

export class WithdrawalComponent implements OnInit {

  @ViewChild('form') form;
  @ViewChild('message') message;
  @ViewChild('comment') comment;
  @ViewChild('method_id') method_id;
  @ViewChild('prop') prop;
  @ViewChild('country') country;
  @ViewChild('amount') amount;
  bsModalRef: BsModalRef;

  public activeTab = 1;
  public responseMessage = null;
  public responseSuccess = false;
  public userBalance:any = {};
  public payMethods:any = [];
  public userProps:any = [];
  public userPayouts:any = [];
  public selectedProp:any = {};
  public request = {
    method_id: 0,
    amount: 0,
    currency: '',
    prop: '',
    country: '',
    comment: '',
  };

  constructor(
    public _service: ComponentService,
    public _router: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this._service.getSelfPayoutData({}).subscribe(res => {
      this.userProps = res.body.props;
      this.userPayouts = res.body.payouts;
      this.payMethods = res.body.methods;
      this.userBalance = res.body.balance;
      this.request.currency = this.userBalance.currency;
    });
  }

  send($event) {

  }

  propSelected(prop) {
    this.request.method_id = prop.method_id;
    this.request.prop = prop.prop;
    this.request.country = prop.country;
  }

  agreement(event, template: TemplateRef<any>) {
    event.preventDefault();
    $(this.form.nativeElement).find('*').removeClass('state-error');
    if(!this.request.method_id) {
      $(this.method_id.nativeElement).focus().closest('label').addClass('state-error');
      return;
    } 
    if(String(this.request.prop).length < 3) {
      $(this.prop.nativeElement).focus().closest('label').addClass('state-error');
      return;
    } 
    $(this.form.nativeElement).find('*').removeClass('state-error');
    if(!this.request.amount) {
      $(this.amount.nativeElement).focus().closest('label').addClass('state-error');
      return;
    }      
  
    this.bsModalRef = this.modalService.show(template);
  }

  agreed() {
    this._service.sendNewPayoutRequest(this.request).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.userPayouts = res.body.payouts;
        this.responseMessage = 'Запрос на вывод средств создан, о результате рассмотрения и будете уведомлены', this.responseSuccess = true;
      } else {
        this.responseMessage = 'Простите, но запрос не создан. Вероятно возникла ошибка в приложении, мы будем признательны если вы сообщите об этом в службу поддержки';
      }
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
      }, 5000);
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Простите, но запрос не создан. Вероятно возникла ошибка в приложении, мы будем признательны если вы сообщите об этом в службу поддержки';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
      }, 5000);
    });
    this.bsModalRef.hide()
  }

  closed() {
    this.bsModalRef.hide()
  }

}
