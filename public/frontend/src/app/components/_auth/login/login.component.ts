import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ComponentService } from '../../components.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

	@ViewChild('form') form;
	@ViewChild('username') username;
	@ViewChild('password') password;

	constructor(
		private router: Router,
    	private service: ComponentService,
    ) { }

	public user = {
		login: '',
		password: '',
		rememberMe: false,
	};

	public responseMessage = null;
	public responseSuccess = false;

	ngOnInit() {

	}

	login(event){
	    event.preventDefault();
	    if(!this.service.isEmail(this.user.login)) return this.username.nativeElement.focus(); 
	    if(this.user.password.length < 8) return this.password.nativeElement.focus();

	    this.service.login(this.user).subscribe((res) => { 
	      if(res.status == 200) {
	      	this.service.storeToken(res.body._token);
	      	this.service._user = res.body.user;
	        this.responseSuccess = true;
	        this.responseMessage = ` привет!`;
	        setTimeout(() => {
	        	let return_url = this.service._user.is_configured ? this.service.storage.fetch('redirect_to') : '/profile/configure';
	        	if(return_url) {
	        		this.service.storage.remove('redirect_to');
	          		this.router.navigate([return_url]);
	        	} else {
	          		this.router.navigate(['/profile/settings']);
	        	}
	        }, 2000);
	      }  
	      if(res.status == 202) {
	      	if(res.body.error == 'user_blocked') {
	          	this.router.navigate(['/auth/locked/' + res.body.id]);
	      	} else if(res.body.error == 'user_not_approved') {
		        this.responseMessage = ' Аккаунт не подтвержден. О статусе проверки мы оповестим на указанный при регистрации email.';
		        setTimeout(() => {
		          this.form.nativeElement.classList.remove('submited');
		          this.username.nativeElement.focus();
		        }, 3000);
	      	} else {
		        this.responseMessage = ' Вы не авторизованы. Проверьте свой логин или пароль.';
		        setTimeout(() => {
		          this.form.nativeElement.classList.remove('submited');
		          this.username.nativeElement.focus();
		        }, 2000);

	      	}
	      }
	      this.form.nativeElement.classList.add('submited');
	    });
	}
}
