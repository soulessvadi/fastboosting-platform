import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ComponentService } from "@app/components/components.service";

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: [
    './recovery.component.css'
  ]
})
export class RecoveryComponent implements OnInit {

  @ViewChild('password') password;
  @ViewChild('passwordc') passwordc;

  public allowAuth: any = false;
  public hash: any = null;
  public user: any = null;
  public success: any = null; 
  public message: any = null; 
  public loading = true;
  public recovery = {
    password: '',
    passwordc: '',
  };

  constructor(private router: Router, private route: ActivatedRoute, public service: ComponentService) { }

  ngOnInit() {
    this.hash = this.route.snapshot.paramMap.get('hash');
    this.service.logout();
    this.service.verifyUser(this.hash).subscribe((res: any) => {
      setTimeout(() => {
        if(res.status == 200 && res.body.user) {
          this.user = res.body.user;
          this.loading = false;
          this.success = true;
          this.message = 'Подтвержден';
        } else {
          this.loading = false;
          this.success = false;
          this.message = 'Доступ к операции отклонен';
        }
      }, 3000);
    }, error => {

    });
  }

  public recover() {
    if(this.recovery.password.length < 8) {
      return this.password.nativeElement.focus();
    }
    if(this.recovery.passwordc != this.recovery.password) {
      return this.passwordc.nativeElement.focus();
    }
    this.loading = true;
    this.success = null;
    this.message = 'Проверяем';
    this.service.recoveryPassword(this.hash, {password: this.recovery.password}).subscribe(res => {
      setTimeout(() => {
        if(res.status == 200) { 
          this.loading = false;
          this.success = true;
          this.message = 'Пароль изменен';
          this.allowAuth = true;
        } else {
          this.loading = false;
          this.success = false;
          this.message = 'Доступ к операции отклонен';
        }
      }, 2000);
    }, (error) => {
      this.loading = false;
      this.success = false;
      this.message = 'Пароль не изменен, попробуйте позже';
    });
  }

}
