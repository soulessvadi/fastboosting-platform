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
    keyword: null,
    sort: 'id',
  };
  public sortings = [
    {field: 'id', name: 'ID'},
    {field: 'name', name: 'Имя'},
    {field: 'domain', name: 'Домен'},
    {field: 'created_at', name: 'Дата создания'},
    {field: 'orders_count', name: 'Кол-во заказов'},
    {field: 'orders_amount', name: 'Сумма заказов'},
  ];

  constructor(public _service: ComponentService) {
    this.fetch();
  }

  public userApprove(user, event) {
    this._service.approvePartner({id:user.id, is_approved:user.is_approved}).subscribe();
  }

  public userBlock(user, event) {
    this._service.blockPartner({id:user.id, is_blocked:user.is_blocked}).subscribe();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getPartners(this.filters).subscribe(res => {
      this.users_total = res.body.users.total;
      this.users = res.body.users.list;
      this.pagination = res.body.users.pagination;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    });
  }

  public remove(user) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить партнера <span class='txt-color-orangeDark'><strong>#${user.id} ${user.name}</strong></span> ?`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removePartner(user.id).subscribe(res => {
            if(!res.error) this.users = this.users.filter(e => e.id != user.id)
          });
        }
      }
    );
  }

  public pageChange(page:number) {
    if(page != this.filters.page) {
      this.filters.page = page;
      this.fetch();
    }
  }
}
