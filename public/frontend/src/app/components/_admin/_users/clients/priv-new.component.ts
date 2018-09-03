import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'user-priv-new',
  templateUrl: './priv-new.component.html',
})

export class PrivNewComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  public users: any = [];
  public menus: any = [];
  public medals: any = [];
  public type: any = [];
  public otypes: any = [];
  public osources: any = [];
  public type_id: number = 0;
  public activeTab = 0;
  public responseMessage = null;
  public responseError = null;
  public Math = Math;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this._service._medals.then((medals: any) => this.medals = medals);
    this.fetch();
  }

  ngOnDestroy() { }

  public save() {
    $('.state-error').removeClass('state-error');
    if(this.type.name.length < 2) {
      this.activeTab = 0;
      return $('#type-name').focus().closest('label').addClass('state-error');
    }
    this.loading = true;
    this._service.createType(this.type_id, this.type).subscribe((res: any) => {
      console.log(res.status)
      if(res.status == 200) {
        this.responseMessage = 'Сохранено';
        this.loading = false;
        setTimeout(() => { 
          this.responseMessage = null; 
          this.router.navigate([`/govt/users/privileges/${res.body.id}`]);
        }, 2000);
      } else {
        this.loading = false;
        if(res.body.error == 'validation_error') {
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
    this._service.getType(this.type_id).subscribe((res: any) => {
      this.menus = res.body.menus;
      this.users = res.body.users;
      this.type = res.body.type;
      this.otypes = res.body.otypes;
      this.osources = res.body.osources;
      if(!this.type.order_permissions || typeof this.type.order_permissions != 'object') 
        this.type.order_permissions = {type: [], source_id: [], mmr_finish: 0, amount: 0, medal_finish: 0};
      if(!this.type.permissions || typeof this.type.permissions != 'object') 
        this.type.permissions = {};
      if(!this.type) 
        this.router.navigate(['/govt/sundry/404']);
    })
  }

  public permissionsTypeChanged($event) {
    if(typeof this.type.order_permissions.type != 'object') this.type.order_permissions.type = [];
    let value = parseInt($event.target.value);
    if($event.target.checked) this.type.order_permissions.type.push(value);
    else this.type.order_permissions.type = this.type.order_permissions.type.filter(e => e != value);
  }
  public permissionsSourceChanged($event) {
    if(typeof this.type.order_permissions.source_id != 'object') this.type.order_permissions.source_id = [];
    let value = parseInt($event.target.value);
    if($event.target.checked) this.type.order_permissions.source_id.push(value);
    else this.type.order_permissions.source_id = this.type.order_permissions.source_id.filter(e => e != value);
  }

  public permissionMenuChanged($event) {
    if(typeof this.type.permissions != 'object') this.type.permissions = {};
    let value = parseInt($event.target.value);
    if($event.target.checked) this.type.permissions[value] = {c:0,r:1,u:0,d:0};
    else delete this.type.permissions[value];
  }
}
