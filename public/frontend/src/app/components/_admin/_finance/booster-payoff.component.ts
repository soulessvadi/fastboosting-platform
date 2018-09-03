import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-booster-payoff',
  templateUrl: './booster-payoff.component.html',
})

export class BoosterPayoffComponent {

  private bsModalRef: BsModalRef;
  public requestEdit: any = {};
  public requests = [];
  public statuses = [];
  public methods = [];
  public currencies = [];
  public requests_total = 0;
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
    {field: 'created_at', name: 'Дата создания'},
    {field: 'status', name: 'Статус'},
    {field: 'user_id', name: 'ID пользователя'},
    {field: 'amount', name: 'Сумма'},
  ];

  constructor(public _service: ComponentService, private modalService: BsModalService) {
    this.fetch();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getPayoutRequests(this.filters).subscribe(res => {
      this.requests_total = res.body.requests.total;
      this.requests = res.body.requests.list;
      this.pagination = res.body.requests.pagination;
      this.statuses = res.body.statuses;
      this.methods = res.body.methods;
      this.currencies = res.body.currencies;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    });
  }

  public remove(request) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить запрос на вывод <span class='txt-color-orangeDark'><strong>#${request.id} ${request.amount}${request.currency}</strong></span> ?`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removePayoutRequest(request.id).subscribe(res => {
            if(!res.error) this.requests = this.requests.filter(e => e.id != request.id)
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

  public edit(request, template: TemplateRef<any>) {
    this.requestEdit = request;
    this.bsModalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  public modalClose() {
    this.requestEdit = {};
    this.bsModalRef.hide();
  }

}
