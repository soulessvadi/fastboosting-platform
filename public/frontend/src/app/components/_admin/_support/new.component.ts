import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new.component.html',
})

export class NewComponent implements OnInit {

  @ViewChild('form') form;
  @ViewChild('message') message;
  @ViewChild('order_number') order_number;
  @ViewChild('user_id') user_id;
  @ViewChild('tx_number') tx_number;
  @ViewChild('theme') theme;
  @ViewChild('description') description;
  public users = [];
  public partners = [];
  public clients = [];
  public boosters = [];
  public responseMessage = null;
  public responseSuccess = false;
  public issues = [
    {text:'Другое', message: '', order_input:false, tx_input:false},
    {text:'Проблемы с заказом', message: '', order_input:true, tx_input:false},
    {text:'Проблемы с оплатой', message: '', order_input:false, tx_input:true},
  ];
  public selectedIssue = this.issues[0];
  public ticket = {
    user_type: 3,
    user_id: 0,
    order_number: '',
    tx_number: '',
    theme: '',
    description: '',
  };

  constructor(public _service: ComponentService, public _router: Router) {

  }

  ngOnInit() {
    this._service.getTicketByNumber(0).subscribe((res: any) => {
      this.partners = res.body.partners;
      this.clients = res.body.clients;
      this.boosters = res.body.boosters;
      this.users = this.boosters;
    })
  }

  send($event) {
    $(this.form.nativeElement).find('*').removeClass('state-error');
    if(!this.ticket.user_id) {
      $(this.user_id.nativeElement).focus().closest('label').addClass('state-error');
      return;
    }
    if(this.order_number && !this.ticket.order_number.length) {
      $(this.order_number.nativeElement).focus().closest('label').addClass('state-error');
      return;
    }
    if(this.tx_number && !this.ticket.tx_number.length) {
      $(this.tx_number.nativeElement).focus().closest('label').addClass('state-error');
      return;
    }
    if(this.ticket.theme.length < 10) {
      $(this.theme.nativeElement).focus().closest('label').addClass('state-error');
      return;
    }
    if(this.ticket.description.length < 50) {
      $(this.description.nativeElement).focus().closest('label').addClass('state-error');
      return;
    }
    $event.target.classList.add('loading');
    this._service.createTicket(this.ticket).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.responseMessage = 'Тикет создан', this.responseSuccess = true;
      } else {
        this.responseMessage = 'Тикет не создан по техническим причинам';
      }
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
        this._router.navigate(['/govt/support/' + res.body.system_number]);
        $event.target.classList.add('loading');
      }, 1500);
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Тикет не отправлено';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
        $event.target.classList.add('loading');
      }, 2500);
    });
  }

}
