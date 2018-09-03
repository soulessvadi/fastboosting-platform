import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'user-edit',
  templateUrl: './edit.component.html',
})

export class EditComponent implements OnInit, OnDestroy {
  @ViewChild('avatarimg') avatarimg;
  public loading: boolean = false;
  public avatarUpload = null;
  public orders: any = [];
  public reviews: any = [];
  public reviewsShown = null;
  public txs: any = [];
  public countries: any = [];
  public currencies: any = [];
  public languages: any = [];
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
  ) { }

  ngOnInit() {
    this.user_id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.fetch();
  }

  ngOnDestroy() { }

  public save() {
    this.loading = true;
    let data = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
    for(let prop in this.user) data.set(prop, this.user[prop]);
    this._service.saveClient(this.user.id, data).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }

  public fetch() {
    this._service.getClient(this.user_id).subscribe((res: any) => {
      this.user = res.body.user;
      this.countries = res.body.countries;
      this.orders = res.body.orders;
      this.txs = res.body.txs;
      this.currencies = res.body.currencies;
      this.languages = res.body.languages;
      this.reviews = res.body.reviews;
      this.reviewsShown = this.reviews.slice(0, 5);
      if(!this.user) this.router.navigate(['/govt/sundry/404']);
    })
  }

  public loadMoreReviews() {
    this.reviewsShown = this.reviewsShown.concat(this.reviews.slice(0, 5));
    this.reviews.splice(0, 5);

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
