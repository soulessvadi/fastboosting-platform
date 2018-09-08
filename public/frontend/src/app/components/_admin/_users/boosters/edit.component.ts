import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'user-edit',
  templateUrl: './edit.component.html',
})

export class EditComponent implements OnInit, OnDestroy {
  @ViewChild('avatarimg') avatarimg;
  private bsModalRef: BsModalRef;
  public avatarUpload = null;
  public reviews = null;
  public reviewsShown = null;
  public logs = null;
  public logsShown = null;
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
  public responseSuccess = false;
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
    this.user_id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.fetch();
  }

  ngOnDestroy() { }

  public save() {
    this.loading = true;
    let data = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
    for(let prop in this.user) {
      if(typeof this.user[prop] == 'object')
        data.set(prop, JSON.stringify(this.user[prop]));
      else
        data.set(prop, this.user[prop]);
    }
    this._service.saveBooster(this.user.id, data).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
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
      this.reviews = res.body.reviews;
      this.reviewsShown = this.reviews.slice(0, 5);
      this.reviews.splice(0, 5);
      this.logs = res.body.logs;
      this.logsShown = this.logs.slice(0, 9);
      this.logs.splice(0, 9);      
      if(!this.user) this.router.navigate(['/govt/sundry/404']);
    })
  }

  public txCreated(tx) {
    if(tx && tx.user_id == this.user.id) {
      this.txs.unshift(tx);
      this.activeTab = 3;
    }
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

  public loadMoreReviews() {
    this.reviewsShown = this.reviewsShown.concat(this.reviews.slice(0, 5));
    this.reviews.splice(0, 5);
  }

  public openModal(event, template: TemplateRef<any>, className?) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template, {class: className || ''});
  }

  public modalClose() {
    this.bsModalRef.hide();
  }

}
