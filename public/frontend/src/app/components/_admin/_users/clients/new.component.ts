import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'user-new',
  templateUrl: './new.component.html',
})

export class NewComponent implements OnInit, OnDestroy {
  @ViewChild('avatarimg') avatarimg;
  public avatarUpload = null;
  public countries: any = [];
  public currencies: any = [];
  public languages: any = [];
  public user_id: number = 0;
  public user: any = null;
  public activeTab = 0;
  public responseMessage = null;
  public responseError = null;
  public Math = Math;
  public loading = false;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetch();
  }

  ngOnDestroy() { }

  public save() {
    $('.state-error').removeClass('state-error');
    if(!this._service.isEmail(this.user.login)) {
      return $('input#login').focus().closest('label').addClass('state-error');
    }
    if(this.user.password.length < 8) {
      return $('input#password').focus().closest('label').addClass('state-error');
    }
    if(this.user.passwordc != this.user.password) {
      return $('input#passwordc').focus().closest('label').addClass('state-error');
    }
    this.loading = true;
    let data = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
    for(let prop in this.user) data.set(prop, this.user[prop]);
    this._service.createClient(this.user.id, data).subscribe((res: any) => {
      if(res.status == 200) {
        this.responseMessage = 'Сохранено';
        this.loading = false;
        setTimeout(() => { 
          this.responseMessage = null; 
          this.router.navigate([`/govt/users/clients/${res.body.id}`]);
        }, 2000);
      } else {
        this.loading = false;
        if(res.body.error == 'login_exists') {
          this.responseError = 'Пользователь с таким логином уже зарегистрирован в системе';
          setTimeout(() => { this.responseError = null; }, 3000);
        } else if(res.body.error == 'validation_error') {
          this.responseError = 'Некоторые из ваших данных не прошли валидацию';
          setTimeout(() => { this.responseError = null; }, 3000);
        } else {
          this.responseError = 'Произошла внутренняя ошибка, повторите попытку';
          setTimeout(() => { this.responseError = null; }, 3000);
        }
      }
    });
  }

  public fetch() {
    this._service.getClient(this.user_id).subscribe((res: any) => {
      this.user = res.body.user;
      this.countries = res.body.countries;
      this.currencies = res.body.currencies;
      this.languages = res.body.languages; 
    })
  }

  public onimgloaded(event) : void {
    var path = event.target.value.split('\\');
    var filename = path.pop();
    var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null;
    if(['jpeg','jpg','gif','png'].indexOf(ext) === -1) {
      return event.target.value = null;
    }
    var files: any = event.target.files;
    var formData: any = new FormData();
    formData.set("files", files[0], files[0]['name']);
    this.avatarUpload = formData;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e:any) => { this.avatarimg.nativeElement.src = e.target.result; }
    reader.readAsDataURL(file);
  }

}
