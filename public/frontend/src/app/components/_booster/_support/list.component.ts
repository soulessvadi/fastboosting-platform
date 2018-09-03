import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './list.component.html',
})

export class ListComponent implements OnInit {

  @ViewChild('chatWindow') chatWindow;
  public chat = {
    room: null,
    messages: null,
    message: null,
  };
  public tickets;
  public pagination;
  public page:number = 1;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private el: ElementRef,
  ) {
    this.fetch();
  }

  ngOnInit() {

  }

  public fetch() {
    this._service.getSelfTickets({page: this.page}).subscribe(res => {
      this.tickets = res.body.tickets;
      this.pagination = res.body.pagination;
    })
  }

  public pageChange(page:number) {
    if(page != this.page) {
      this.page = page;
      this.fetch();
    }
  }
}
