import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'user-new',
  templateUrl: './new.component.html',
})

export class NewComponent implements OnInit, OnDestroy {
  @ViewChild('avatarimg') avatarimg;
  private bsModalRef: BsModalRef;
  public avatarUpload = null;
  public menus: any = [];
  public medals: any = [];
  public heroes: any = [];
  public loading: boolean = false;
  public lanes: any = [];
  public orders: any = [];
  public txs: any = [];
  public otypes: any = [];
  public osources: any = [];
  public countries: any = [];
  public currencies: any = [];
  public languages: any = [];
  public ratings: any = [];
  public user_id: number;
  public user: any = null;
  public activeTab = 0;
  public responseMessage = null;
  public responseError = null;
  public Math = Math;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService, 
  ) { }

  ngOnInit() {
    this._service._medals.then((medals: any) => this.medals = medals);
    this._service._heroes.then((heroes: any) => this.heroes = heroes);
    this._service._lanes.then((lanes: any) => this.lanes = lanes);
    this.user_id = 0;
    this.fetch();
  }

  ngOnDestroy() { }


  public save() {
    $('.state-error').removeClass('state-error');
    if(!this._service.isEmail(this.user.login)) {
      this.activeTab = 0;
      return $('input#login').focus().closest('label').addClass('state-error');
    }
    if(this.user.password.length < 8) {
      this.activeTab = 0;
      return $('input#password').focus().closest('label').addClass('state-error');
    }
    if(this.user.passwordc != this.user.password) {
      this.activeTab = 0;
      return $('input#passwordc').focus().closest('label').addClass('state-error');
    }
    this.loading = true;
    let data = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
    for(let prop in this.user) data.set(prop, this.user[prop]);
    this._service.createBooster(this.user.id, data).subscribe((res: any) => {
      if(res.status == 200) {
        this.responseMessage = 'Сохранено';
        this.loading = false;
        setTimeout(() => { 
          this.responseMessage = null; 
          this.router.navigate([`/govt/boosters/${res.body.id}`]);
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
    this._service.getBooster(this.user_id).subscribe((res: any) => {
      this.user = res.body.user;
      this.countries = res.body.countries;
      this.orders = res.body.orders;
      this.txs = res.body.txs;
      this.currencies = res.body.currencies;
      this.ratings = res.body.ratings;
      this.languages = res.body.languages;
      this.otypes = res.body.otypes;
      this.osources = res.body.osources;
      this.menus = res.body.menus;
      if(!this.user) this.router.navigate(['/govt/sundry/404']);
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

  public heroesChanged(hero) {
    if(typeof this.user.heroes != 'object') this.user.heroes = [];
    if(hero.checked) 
      this.user.heroes.push(hero.id);
    else if (this.user.heroes.indexOf(hero.id) !== -1)
      this.user.heroes.splice(this.user.heroes.indexOf(hero.id), 1);
  }

  public lanesChanged(lane) {
    if(typeof this.user.lanes != 'object') this.user.lanes = [];
    if(lane.checked) this.user.lanes.push(lane.id);
    else this.user.lanes = this.user.lanes.filter(e => e != lane.id);
  }

  public permissionsTypeChanged($event) {
    if(typeof this.user.order_permissions.type != 'object') this.user.order_permissions.type = [];
    let value = parseInt($event.target.value);
    if($event.target.checked) this.user.order_permissions.type.push(value);
    else this.user.order_permissions.type = this.user.order_permissions.type.filter(e => e != value);
  }
  public permissionsSourceChanged($event) {
    if(typeof this.user.order_permissions.source_id != 'object') this.user.order_permissions.source_id = [];
    let value = parseInt($event.target.value);
    if($event.target.checked) this.user.order_permissions.source_id.push(value);
    else this.user.order_permissions.source_id = this.user.order_permissions.source_id.filter(e => e != value);
  }

  public permissionMenuChanged($event) {
    if(typeof this.user.permissions != 'object') this.user.permissions = {};
    let value = parseInt($event.target.value);
    if($event.target.checked) this.user.permissions[value] = {c:0,r:1,u:0,d:0};
    else delete this.user.permissions[value];
  }

  public openModal(event, template: TemplateRef<any>) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  public modalClose() {
    this.bsModalRef.hide();
  }

}
