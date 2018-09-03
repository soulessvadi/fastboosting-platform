import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-users',
  templateUrl: './allusers.component.html',
})

export class AllUsersComponent {

  public users = [];
  public users_total = 0;
  public pagination;
  public types: any = [];
  public showFilters: boolean = false;

  public filters = {
    page: 1,
    asc: 0,
    status: 0,
    working: 0,
    type: 0,
    block: 0,
    approved: 0,
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
    {field: 'active_order', name: 'Наличие заказа'},
  ];

  constructor(public _service: ComponentService) {
    this.fetch();
  }

  public userApprove(user, event) {
    this._service.approveUser({id:user.id, is_approved:user.is_approved}).subscribe();
  }

  public userBlock(user, event) {
    this._service.blockUser({id:user.id, is_blocked:user.is_blocked}).subscribe();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.user_types.then(res => {
      this.types = res;
    })
    this._service.getAllUsers(this.filters).subscribe(res => {
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

  public remove(user) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить пользователя <span class='txt-color-orangeDark'><strong>#${user.id} ${user.first_name} ${user.last_name}</strong></span> ?`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removeUser(user.id).subscribe(res => {
            if(!res.error) this.users = this.users.filter(e => e.id != user.id)
          });
        }
      }
    );
  }

}
