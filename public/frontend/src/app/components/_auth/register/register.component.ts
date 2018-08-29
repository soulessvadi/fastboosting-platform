import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ComponentService } from '../../components.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})

export class RegisterComponent implements OnInit {

  @ViewChild('form') form;
  @ViewChild('username') username;
  @ViewChild('email') email;
  @ViewChild('password') password;
  @ViewChild('passwordConfirm') passwordConfirm;

  bsModalRef: BsModalRef;

  public user = {
    login: '',
    password: '',
    passwordConfirm: '',
    nick_name: '',
    termsAgreed: false,
    subscribe: true,
  };

  public responseMessage = null;
  public responseSuccess = false;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private service: ComponentService,
  ) {}
 
  ngOnInit() {}

  register(event) {
    event.preventDefault();
    if(!this.isEmail(this.user.login)) return this.email.nativeElement.focus(); 
    if(this.user.nick_name.length < 5) return this.username.nativeElement.focus(); 
    if(this.user.password.length < 8) return this.password.nativeElement.focus();
    if(this.user.passwordConfirm != this.user.password) return this.passwordConfirm.nativeElement.focus();
    if(!this.user.termsAgreed) return this.user.termsAgreed = true;
    this.service.register(this.user).subscribe((res) => { 
      if(res.status == 200) {
        this.responseSuccess = true;
        this.responseMessage = `<b>${this.user.nick_name}</b> ваша заявка принята. На email <b>${this.user.login}</b> будет выслано письмо о результате рассмотрения`;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 5000);
      }  
      if(res.status == 202) {
        if(res.body.error == 'invalid_login')
          this.responseMessage = 'Ваш логин - это используемый вами email';
        else if(res.body.error == 'invalid_password')
          this.responseMessage = 'Слишком короткий пароль';
        else if(res.body.error == 'user_exists')
          this.responseMessage = `Пользователь <b>${this.user.login}</b> уже зарегистрирован в системе`;
        else
          this.responseMessage = `На данный момент регистрация запрещена, повторите попытку позже`;
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
          this.username.nativeElement.focus();
        }, 2500);
      }
      this.form.nativeElement.classList.add('submited');
    });
  }

  isEmail(mixed) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(mixed);
  }

  openModal(event, template: TemplateRef<any>) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  onTermsAgree(){
    this.user.termsAgreed = true
    this.bsModalRef.hide()
  }

  onTermsClose(){
    this.bsModalRef.hide()
  }

}
