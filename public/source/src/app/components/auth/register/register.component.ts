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
    email: '',
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
    if(this.user.login.length < 5) return this.username.nativeElement.focus(); 
    if(!this.isEmail(this.user.email)) return this.email.nativeElement.focus(); 
    if(this.user.password.length < 8) return this.password.nativeElement.focus();
    if(this.user.passwordConfirm != this.user.password) return this.passwordConfirm.nativeElement.focus();
    if(!this.user.termsAgreed) return this.user.termsAgreed = true;
    this.service.register(this.user).subscribe((res) => { 
      if(res.status == 201) {
        this.responseSuccess = true;
        this.responseMessage = `Спасибо за регистрацию <b>${this.user.login}</b>! О результатах проверки ты будешь оповещен на ${this.user.email}`;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 5000);
      }  
      if(res.status == 200) {
        this.responseMessage = `Пользователь с именем <b>${this.user.login}</b> уже зарегистрирован в системе`;
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
          this.username.nativeElement.focus();
        }, 2000);
      }
      if(res.status == 202) {
        this.responseMessage = 'Данные не прошли валидацию, заполни форму снова удовлетворяя ее требования';
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
          this.username.nativeElement.focus();
        }, 2000);
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
