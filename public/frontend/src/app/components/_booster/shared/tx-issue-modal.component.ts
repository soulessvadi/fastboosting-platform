import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tx-issue-modal',
  templateUrl: './tx-issue-modal.component.html',
})

export class TxIssueModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() tx;
  @ViewChild('form') form;
  @ViewChild('message') message;
  @ViewChild('tx_number') tx_number;
  @ViewChild('theme') theme;
  @ViewChild('description') description;

  public responseMessage = null;
  public responseSuccess = false;
  public ticket = {
    order_number: '',
    tx_number: '',
    theme: '',
    description: '',
  };

  constructor(public _service: ComponentService, public _router: Router) {

  }

  ngOnInit() {
    this.ticket.tx_number = this.tx.system_number;
  }

  send($event) {
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
        this.responseMessage = 'Ваше обращение доставлено. Об ответе вы будете уведомлены.', this.responseSuccess = true;
      } else {
        this.responseMessage = 'Обращение не отправлено по причине ...';
      }
      setTimeout(() => {
        this.close.emit(true);
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
