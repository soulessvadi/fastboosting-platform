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
  @ViewChild('tx_number') tx_number;
  @ViewChild('theme') theme;
  @ViewChild('description') description;

  public responseMessage = null;
  public responseSuccess = false;
  public issues = [
    {text:'Другое', message: '', order_input:false, tx_input:false},
    {text:'Проблемы с заказом', message: '', order_input:true, tx_input:false},
    {text:'Проблемы с оплатой', message: '', order_input:false, tx_input:true},
  ];
  public selectedIssue = this.issues[0];
  public ticket = {
    order_number: '',
    tx_number: '',
    theme: '',
    description: '',
  };

  constructor(public _service: ComponentService, public _router: Router) {

  }

  ngOnInit() {

  }

  send($event) {
    $(this.form.nativeElement).find('*').removeClass('state-error');
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
    this._service.sendNewTicket(this.ticket).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.responseMessage = 'Обращение отправлено', this.responseSuccess = true;
      } else {
        this.responseMessage = 'Обращение не отправлено по причине ...';
      }
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
        this._router.navigate(['/support/issues']);
        $event.target.classList.add('loading');
      }, 2500);
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Обращение не отправлено';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
        $event.target.classList.add('loading');
      }, 2500);
    });
  }

}
