import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-client-refill',
  templateUrl: './client-refill.component.html',
})

export class ClientRefillComponent {
  private bsModalRef: BsModalRef;
  public Math = Math;
  public txEdit: any = {};
  public txs: any = [];
  public txs_total = 0;
  public pagination: any = {};
  public types: any = [];
  public statuses: any = [];
  public currencies: any = [];
  public showFilters: boolean = false;
  public filters = {
    type: [1, 3],
    utype: 4,
    page: 1,
    asc: 0,
    keyword: null,
    status: 0,
    sort: 'id',
  };
  public sortings = [
    {field: 'id', name: 'ID'},
    {field: 'created_at', name: 'Дата создания'},
    {field: 'system_number', name: 'Номер'},
    {field: 'status', name: 'Статус'},
    {field: 'type', name: 'Тип'},
    {field: 'amount', name: 'Сумма'},
  ];

  constructor(public _service: ComponentService, private modalService: BsModalService) {
    this.fetch();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getTxs(this.filters).subscribe(res => {
      this.txs_total = res.body.txs.total;
      this.txs = res.body.txs.list;
      this.pagination = res.body.txs.pagination;
      this.statuses = res.body.statuses;
      this.types = res.body.types;
      this.currencies = res.body.currencies;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    });
  }

  public remove(tx) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить трансакцию <span class='txt-color-orangeDark'><strong>#${tx.system_number}</strong></span> ?`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removeTx(tx.id).subscribe(res => {
            if(!res.error) this.txs = this.txs.filter(e => e.id != tx.id)
          });
        }
      }
    );
  }

  public edit(tx, template: TemplateRef<any>) {
    this.txEdit = tx;
    this.bsModalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  public modalClose() {
    this.bsModalRef.hide();
  }

  public pageChange(page:number) {
    if(page != this.filters.page) {
      this.filters.page = page;
      this.fetch();
    }
  }
}
