import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './list.component.html',
})

export class ListComponent {

  public users = [];
  public users_total = 0;
  public pagination;
  public types: any = [];
  public showFilters: boolean = false;

  public filters = {
    page: 1,
    asc: 0,
    status: 0,
    activity: 0,
    working: 0,
    block: 0,
    keyword: null,
    action: 0,
    sort: 'id',
  };

  public sortings = [
    {field: 'id', name: 'ID'},
    {field: 'created_at', name: 'Дата регистрации'},
    {field: 'first_name', name: 'Имя пользователя'},
    {field: 'nick_name', name: 'Никнейм'},
    {field: 'balance', name: 'Баланс'},
    {field: 'is_active', name: 'Активность'},
    {field: 'active_order', name: 'Наличие заказа'},
  ];

  constructor(public _service: ComponentService) {
    this.fetch();
  }

  public userBlock(user, event) {
    this._service.blockUser({id:user.id, is_blocked:user.is_blocked}).subscribe();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getBoosters(this.filters).subscribe(res => {
      this.users_total = res.body.users.total;
      this.users = res.body.users.list;
      this.pagination = res.body.users.pagination;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    });
  }

  public pageChange(page:number) {
    if(page != this.filters.page) {
      this.filters.page = page;
      this.fetch();
    }
  }
}
