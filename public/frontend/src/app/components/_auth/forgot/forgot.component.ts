import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ComponentService } from '../../components.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styles: []
})
export class ForgotComponent implements OnInit {

  @ViewChild('username') username;
  @ViewChild('email') email;
  @ViewChild('form') form;
  public responseSuccess = false;
  public responseMessage = '';
  public recovery = {
    email: '',
    username: '',
  };

  constructor(private router: Router, private service: ComponentService) { 

  }

  ngOnInit() {

  }

  public recover(event){
    event.preventDefault();
    if(!this.isEmail(this.recovery.email) && !this.recovery.username.length) 
      return this.email.nativeElement.focus(); 
    if(!this.isEmail(this.recovery.email) && this.recovery.username.length < 5) 
      return this.username.nativeElement.focus();
    this.service.recovery(this.recovery).subscribe((res) => { 
      if(res.status == 200) {
        this.responseSuccess = true;
        this.responseMessage = 'На ваш email отправлено письмо с иструкциями по восстановлению доступа.';
      }  
      if(res.status == 202) {
        if(res.body.error == 'user_absent') {
          this.responseMessage = 'Аккаунт для восстановления не найден';
        }
        if(res.body.error == 'invalid_email') {
          this.responseMessage = 'Используйте действительный email указанный при регистрации аккаунта';
        }
        if(res.body.error == 'invalid_username') {
          this.responseMessage = 'Слишком короткое имя пользователя';
        }
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
          this.username.nativeElement.focus();
        }, 3000);
      }
      this.form.nativeElement.classList.add('submited');
    });
  }

  isEmail(mixed) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(mixed);
  }

}
