import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'password-modal',
  templateUrl: './password-modal.component.html',
})

export class PasswordModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @ViewChild('form') form;
  @ViewChild('pold') pold;
  @ViewChild('pnew') pnew;
  @ViewChild('pnewc') pnewc;
  public password = {
    old: '',
    new: '',
    new_confirmation: '',
  };
  public responseMessage = null;
  public responseSuccess = false;

  constructor(public _service: ComponentService) {

  }

  public save() {
    if(this.password.old.length < 8) {
      return this.pold.nativeElement.focus();
    }
    if(this.password.new.length < 8) {
      return this.pnew.nativeElement.focus();
    }
    if(this.password.new_confirmation != this.password.new) {
      return this.pnewc.nativeElement.focus();
    }
    this._service.changePassword(this.password).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.responseMessage = `Пароль от аккаунта изменен, информация о смене будет отправлена на ваш email`, this.responseSuccess = true;
        setTimeout(() => { this.close.emit(true); }, 2500);
      } else {
        if(res.body.error == 'incorrect_password') {
          this.responseMessage = 'Доступ к операции отклонен, проверьте не ошиблись ли вы при вводе пароля';
        } else {
          this.responseMessage = 'Пароль не изменен, попробуйте позже';     
        }
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
        }, 2500);
      }
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Пароль не изменен, попробуйте позже';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
      }, 2500);
    });
  }

  ngOnInit() {

  }

}
