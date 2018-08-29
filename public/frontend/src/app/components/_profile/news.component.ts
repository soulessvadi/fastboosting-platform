import { Component, OnInit, Input } from '@angular/core';
import { ComponentService } from '../components.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
})

export class NewsComponent implements OnInit {

  @Input() news:any = {};

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {

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

}
