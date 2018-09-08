import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'news-post',
  templateUrl: './news-post.component.html',
})

export class NewsPostComponent implements OnInit {
  @ViewChild('coverimg') coverimg;
  public cover:FormData = null;
  public responseMessage = null;
  public responseSuccess = false;
  public loading = false;
  public filters = {
    page: 1,
    asc: 0,
    keyword: null,
  };
  public post_id: number = 0;
  public post: any = null;
  public tags: any = [];
  constructor(
    public _service: ComponentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.post_id = parseInt(this.route.snapshot.paramMap.get('id')) || 0;
    this.fetch();
  }

  public remove(post) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить новость <span class='txt-color-orangeDark'><strong>#${post.id}</strong></span> ?`,
        content: `&laquo;${post.title}&raquo;`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removePost(post.id).subscribe(res => {
            if(!res.error) this.router.navigate(['/govt/settings/news']);
          });
        }
      }
    );
  }

  public pageChange(page:number) {
    if(page != this.filters.page) {
      console.log(page);
      this.filters.page = page;
      this.fetch();
    }
  }

  public save() {
    this.loading = true;
    let formData = this.cover instanceof FormData ? this.cover : new FormData();
    for(let x in this.post) {
      formData.set(x, this.post[x]);
    }
    this._service.updatePost(this.post.id, formData).subscribe((res) => {
      this.responseMessage = 'Сохранено';
      setTimeout(() => {this.loading = false;this.responseMessage = null;}, 1000);
    }, (error) => {
      this.responseMessage = 'Ошибка';
      setTimeout(() => {this.loading = false;this.responseMessage = null;}, 1000);
    });
  }

  public publish(post) {
    this._service.publishPost(post.id, {publish: !post.publish}).subscribe(res => {
      post.publish = !post.publish;
    })
  }

  public addRecipient(event, name) {
    let area = $(event.target).parents('.replies').find('textarea');
    let message = area.val();
    area.val(`@[${name}] ` + message).focus();
  }

  public postMessage(event, post) {
    let data = {
      message: post.new_message,
      id: post.id,
    };
    if(data.message.length < 5) {
      return $(event.target).parents('.chat-form').find('textarea').focus();
    }
    this._service.postComment(data).subscribe(res => {
      if(res.status == 200) {
        post.comments.push(res.body);
        post.new_message = '';
      }
    });
  }

  public fetch() {
    this._service.getPost(this.post_id).subscribe(res => {
      this.post = res.body.post;
    })
  }

  onimgloaded(event) : void {
    var path = event.target.value.split('\\');
    var filename = path.pop();
    var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null;
    if(['jpeg','jpg','gif','png'].indexOf(ext) === -1) {
      return event.target.value = null;
    }
    var files: any = event.target.files;
    var formData: any = new FormData();
    formData.set("files", files[0], files[0]['name']);
    this.cover = formData;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e:any) => { this.coverimg.nativeElement.src = e.target.result; }
    reader.readAsDataURL(file);
  }

  public getDate(property, a, b) {
    let time = moment(property).format('HH:mm:ss');
    let date = moment(property).format('DD.MM.YYYY');
    if(b == 'time') {
      time = moment(a.value, 'HH:mm:ss').format('HH:mm:ss');
    } else {
      date = moment(a, 'DD.MM.YYYY').format('DD.MM.YYYY');
    }
    let datetime = moment(date + ' ' + time, 'DD.MM.YYYY HH:mm:ss').toISOString();
    return datetime;
  }

}
