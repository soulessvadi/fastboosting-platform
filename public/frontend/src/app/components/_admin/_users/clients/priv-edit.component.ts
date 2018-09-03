import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'user-priv-edit',
  templateUrl: './priv-edit.component.html',
})

export class PrivEditComponent implements OnInit, OnDestroy {
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
  public responseSuccess = false;
  public Math = Math;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this._service._medals.then((medals: any) => this.medals = medals);
    this.type_id = parseInt(this.route.snapshot.paramMap.get('id'));
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
    this._service.saveType(this.type_id, this.type).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
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

  public userBlock(user, event) {
    this._service.blockUser({id:user.id, is_blocked:user.is_blocked}).subscribe();
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
