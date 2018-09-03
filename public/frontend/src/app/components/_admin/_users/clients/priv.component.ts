import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-privileges',
  templateUrl: './priv.component.html',
})

export class PrivComponent {

  public types = [];
  public types_total = 0;
  public pagination;
  public showFilters: boolean = false;
  public filters = {
    page: 1,
    asc: true,
    keyword: null,
    sort: 'id',
  };
  public sortings = [
    {field: 'id', name: 'ID'},
    {field: 'created_at', name: 'Дата создания'},
    {field: 'updated_at', name: 'Дата обновления'},
    {field: 'name', name: 'Название группы'},
    {field: 'users_in', name: 'Кол-во пользователей'},
  ];

  constructor(public _service: ComponentService) {
    this.fetch();
  }

  public remove(type) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить группу <span class='txt-color-orangeDark'><strong>${type.name}</strong></span> ?`,
        content: `Убедитесь что в группе нет пользователей`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removeType(type.id).subscribe(res => {
            if(!res.error) this.types = this.types.filter(e => e.id != type.id)
          });
        }
      }
    );
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getUsersTypes(this.filters).subscribe(res => {
      this.types_total = res.body.types.total;
      this.types = res.body.types.list;
      this.pagination = res.body.types.pagination;
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
