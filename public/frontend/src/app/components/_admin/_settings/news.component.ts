import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'news-list',
  templateUrl: './news.component.html',
})

export class NewsComponent implements OnInit {
  public responseMessage = null;
  public responseSuccess = false;
  public loading = false;
  public filters = {
    page: 1,
    asc: 0,
    keyword: null,
  };
  public news: any = [];
  public tags: any = [];
  public videos: any = [];
  public loadedVideo: any = null;
  public pagination: any = [];
  constructor(
    public _service: ComponentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetch();
  }

  public addPost() {
    this._service.smartMessageBox({
        title: `<i class='fas fa-calendar-plus txt-color-orangeDark'></i> Создать новость ?`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.addPost().subscribe((res:any) => {
            if(res.status == 200) this.router.navigate(['/govt/settings/news/' + res.body.id]);
          });
        }
      }
    );
  }

  public remove(post) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить новость <span class='txt-color-orangeDark'><strong>#${post.id}</strong></span> ?`,
        content: `&laquo;${post.title}&raquo;`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removePost(post.id).subscribe(res => {
            if(!res.error) this.news = this.news.filter(e => e.id != post.id)
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
    this._service.getAllNews(this.filters).subscribe(res => {
      this.videos = res.body.videos;
      this.tags = res.body.tags;
      this.news = res.body.news.list;
      this.pagination = res.body.news.pagination;
      this.loadedVideo = this.videos.find((e, i) => !i)
    })
  }

}
