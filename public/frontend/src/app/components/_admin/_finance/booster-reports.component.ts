import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-booster-reports',
  templateUrl: './booster-reports.component.html',
})

export class BoosterReportsComponent {
  private bsModalRef: BsModalRef;
  public Math = Math;
  public reportEdit: any = {};
  public reports: any = [];
  public medals: any = [];
  public reports_total = 0;
  public pagination: any = {};
  public types: any = [];
  public statuses: any = [];
  public currencies: any = [];
  public showFilters: boolean = false;
  public filters = {
    type: 2,
    utype: 3,
    page: 1,
    asc: 0,
    keyword: null,
    status: 0,
    sort: 'id',
  };
  public sortings = [
    {field: 'id', name: 'ID'},
    {field: 'created_at', name: 'Дата создания'},
    {field: 'order_id', name: 'Номер заказа'},
    {field: 'user_id', name: 'ID пользователя'},
    {field: 'finisher', name: 'Тип отчета'},
  ];

  constructor(public _service: ComponentService, private modalService: BsModalService) {
    this.fetch();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service._medals.then(res => {
      this.medals = res;
    })
    this._service.getReports(this.filters).subscribe(res => {
      this.reports_total = res.body.reports.total;
      this.reports = res.body.reports.list;
      this.pagination = res.body.reports.pagination;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    });
  }

  public remove(report) {
    this._service.smartMessageBox({
        title: `<i class='fas fa-trash txt-color-orangeDark'></i> Удалить отчет <span class='txt-color-orangeDark'><strong>#${report.id} ${report.comment}</strong></span> ?`,
        buttons: "[Нет][Да]"
      }, (a,b,c) => {
        if (c == 1) {
          this._service.removeReport(report.id).subscribe(res => {
            if(!res.error) this.reports = this.reports.filter(e => e.id != report.id)
          });
        }
      }
    );
  }

  public edit(report, template: TemplateRef<any>) {
    this.reportEdit = report;
    this.bsModalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  public modalClose() {
    this.reportEdit = {};
    this.bsModalRef.hide();
  }

  public pageChange(page:number) {
    if(page != this.filters.page) {
      this.filters.page = page;
      this.fetch();
    }
  }
}
