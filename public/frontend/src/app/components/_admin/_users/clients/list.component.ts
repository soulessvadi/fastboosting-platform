import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-clients-list',
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
    keyword: null,
    action: 0,
    sort: 'created_at',
  };
  public sortings = [
    {field: 'id', name: 'ID'},
    {field: 'created_at', name: 'Дата регистрации'},
    {field: 'first_name', name: 'Имя пользователя'},
    {field: 'nick_name', name: 'Никнейм'},
    {field: 'balance', name: 'Баланс'},
    {field: 'orders_count', name: 'Кол-во заказов'},
    {field: 'orders_amount', name: 'Сумма заказов'},
  ];

  constructor(public _service: ComponentService) {
    this.fetch();
  }

  public userBlock(user, event) {
    this._service.blockUser({id:user.id, is_blocked:user.is_blocked}).subscribe();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getClients(this.filters).subscribe(res => {
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
