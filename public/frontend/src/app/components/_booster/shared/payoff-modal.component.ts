import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'payoff-modal',
  templateUrl: './payoff-modal.component.html',
})

export class PayoffModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() request;
  @Input() req;
  @Input() tx;
  @Input() statuses;
  @Input() methods;
  @Input() currencies;


  @ViewChild('form') form;
  @ViewChild('message') message;

  public responseMessage: any = 'Поиск';
  public responseSuccess: any = 'loading';

  constructor(public _service: ComponentService) {
  }

  ngOnInit() {
    this._service.getPayoutRequest(this.request.id).subscribe(res => {
      if(res.status == 200) {
        this.responseMessage = null;
        this.req = res.body.request;
        this.tx = res.body.tx;
      } else {
        this.responseSuccess = false;
        this.responseMessage = 'Запрос не найден';
      }
    }, (error) => null);
  }

  send() {
    if(!this.req) return null;
    this.responseSuccess = false;
    this._service.savePayoutRequest(this.req.id, this.req).subscribe(res => {
      if(res.status == 200) { 
        this.responseMessage = 'Сохранено'; 
        this.responseSuccess = true;
        this.request.status = this.req.status;
        this.request.status_name = this.req.status_name;
        this.request.amount = this.req.amount;
        this.request.comment = this.req.comment;
        this.request.prop = this.req.prop;
        this.request.country = this.req.country;
        this.request.tx_system_number = res.body.tx;
        setTimeout(() => {
          this.close.emit(true);
        }, 1500);
      } else {
        this.responseMessage = 'Возникли проблемы. Попробуйте позже.';
        setTimeout(() => {
          this.responseMessage = null;
        }, 1500);
      }
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Возникли проблемы. Попробуйте позже.';            
      setTimeout(() => {
        this.responseMessage = null;
      }, 1500);
    });
  }

}
