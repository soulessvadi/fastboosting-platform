import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  public pageName: string = "";
  public pagination;
  public statuses: any = [];
  public authors: any = [];
  public types: any = [];
  public filters = {
    show: 0,
    page: 1,
    asc: 0,
    status: 0,
    author: 0,
    keyword: null,
    action: 0,
    sort: 'created_at',
  };
  public sortings = [
    {field: 'created_at', name: 'Дата создания'},
    {field: 'status', name: 'Статус'},
    {field: 'system_number', name: 'Номер тикета'},
    {field: 'client_id', name: 'ID автора'},
  ];

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
  ) {
    this.route.snapshot.url.map(e => {
      if(e.path == 'boosters') {this.filters.action = 3;this.pageName="Тикеты бустеров"}
      else if(e.path == 'clients') {this.filters.action = 4;this.pageName="Тикеты клиентов"}
      else if(e.path == 'partners') {this.filters.action = 5;this.pageName="Тикеты партнеров"}
      else {this.filters.action = 5;this.pageName="Тикеты пользователей"}
    });
    this._service._tickets_statuses.then(res => this.statuses = res);
    this._service._tickets_types.then(res => this.types = res);
    this.fetch();
  }

  ngOnInit() {

  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getAllTickets(this.filters).subscribe(res => {
      this.tickets = res.body.tickets.list;
      this.pagination = res.body.tickets.pagination;
      this.authors = res.body.authors;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    });
  }

  public pageChange(page:number) {
    if(page != this.filters.page) {
      console.log(page);
      this.filters.page = page;
      this.fetch();
    }
  }
}
