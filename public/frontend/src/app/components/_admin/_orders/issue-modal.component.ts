import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'issue-modal',
  templateUrl: './issue-modal.component.html',
})

export class IssueModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() order;
  @ViewChild('form') form;
  @ViewChild('message') message;

  public responseMessage = null;
  public responseSuccess = false;
  public issues = [
    {text:'Не правильные доступы', message: '', area:false},
    {text:'Не настроен семейный просмотр', message: '', area:false},
    {text:'Не верный ммр', message: '', area:false},
    {text:'Аккаунт в лоу приорити', message: '', area:false},
    {text:'Другая причина...', message: '', area:true},
  ];
  public selectedIssue = this.issues[0];

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {

  }

  send() {
    if(this.selectedIssue.area && this.selectedIssue.message.length < 5) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Заполните описание';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
        this.message.nativeElement.focus();
      }, 1500);
      return;
    }
    this._service.sendOrderIssue(this.selectedIssue).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.responseMessage = 'Рапорт отправлен', this.responseSuccess = true;
        setTimeout(() => {
          this.close.emit(true);
        }, 2500);
      } else {
        if(res.error == 'operation_not_allowed') {
          this.responseMessage = 'Рапорт об ошибке этого заказа уже создан';
        } else {
          this.responseMessage = 'Рапорт не отправлен';
        }
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
        }, 2500);
      }
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Рапорт не отправлен';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
      }, 2500);
    });
  }

}
