import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import * as moment from 'moment';

@Component({
  selector: 'orders-list',
  templateUrl: './problematic.component.html',
})

export class ProblematicComponent implements OnInit {
  public orders: any = [];
  public orders_types: any = [];
  public lanes: any = [];
  public servers: any = [];
  public ranks: any = [];
  public services: any = [];
  public statuses: any = [];
  public boosters: any = [];
  public clients: any = [];
  public partners: any = [];
  public filters = {
    show: false,
    asc: 0,
    type: 0,
    status: 0,
    client: 0,
    booster: 0,
    partner: 0,
    keyword: null,
    sort: 'created_at',
  };
  public sortings = [
    {field: 'created_at', name: 'Дата создания'},
    {field: 'deadline', name: 'Дедлайн'},
    {field: 'status', name: 'Статус'},
    {field: 'type', name: 'Тип'},
    {field: 'system_number', name: 'Номер заказа'},
    {field: 'client_id', name: 'ID клиента'},
    {field: 'partner_id', name: 'ID источника'},
    {field: 'amount', name: 'Стоимость'},
    {field: 'salary_run', name: 'Оплата бустеру'},
  ];

  constructor(public _service: ComponentService, private router: Router) {
    this.fetch();
  }

  public fetch() {
    $('#sync_button').addClass('loading');
    this._service.getProblematicOrders(this.filters).subscribe((res: any) => {
      this.orders = res.body.orders;
      this.orders_types = res.body.types;
      this.lanes = res.body.lanes;
      this.servers = res.body.servers;
      this.ranks = res.body.ranks;
      this.services = res.body.services;
      this.statuses = res.body.statuses;
      this.boosters = res.body.boosters;
      this.clients = res.body.clients;
      this.partners = res.body.partners;
      setTimeout(() => {$('#sync_button').removeClass('loading')}, 1000);
    }, (e) => console.log(e));
  }

  ngOnInit() {

  }

  showDetails(event, data) {
      let tr = $(event.target).parents("tr");
      let details = tr.next('tr.details');

      if (details.length) {
        tr.removeClass("shown");
        details.remove();
      } else {
        tr.addClass("shown");
        tr.after(this.detailsFormat(data));
      }
  }

  public detailsFormat(d) {
    let html;
    if(d.type == 1) {
      html =  `
          <tr class="details"><td colspan="10"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                  <td>Линии для игры:</td>
                  <td>
                    <div class="project-members lanes">`;
                    if(d.lanes && d.lanes.length) {
                      this.lanes.forEach(e => {
                        if(d.lanes.includes(e.id))
                          html += `<a href="javascript:void(0)"><span>${e.name}</span></a>`; 
                      });
                    } else {
                          html += `<a href="javascript:void(0)"><span>Любая</span></a>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
                <tr>
                    <td>Сервера для игры:</td>
                    <td>
                      <div class="project-members lanes">`;
                      if(d.servers && d.servers.length) {
                        this.servers.forEach(e => {
                          if(d.servers.includes(e.id))
                            html += `<a href="javascript:void(0)"><span>${e.name}</span></a>`; 
                        });
                      } else {
                            html += `<a href="javascript:void(0)"><span>Любой</span></a>`; 
                      }
                      html += `</div> 
                    </td>
                </tr>
                <tr>
                    <td>Комментарий клиента:</td>
                    <td>${d.client_comment}</td>
                </tr>
                <tr>
                    <td>MMR стартовый:</td>
                    <td>${d.mmr_start}</td>
                </tr>
                <tr>
                    <td>MMR текущий:</td>
                    <td>${d.mmr_start + d.mmr_boosted}</td>
                </tr>
                <tr>
                    <td>MMR желаемый:</td>
                    <td>${d.mmr_finish}</td>
                </tr>
                <tr>
                    <td>MMR / побед осталось:</td>
                    <td><strong>${d.mmr_finish - d.mmr_start + d.mmr_boosted} / ${(d.mmr_finish - d.mmr_start + d.mmr_boosted)/25}</strong></td>
                </tr>
          </tbody></table></td></tr>`;
     } else if (d.type == 2) {
      html =  `
          <tr class="details"><td colspan="10"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                    <td>Комментарий клиента:</td>
                    <td>${d.client_comment}</td>
                </tr>
                <tr>
                    <td>Игр сыграно / осталось:</td>
                    <td><strong>${d.cali_games_done} / ${10 - d.cali_games_done}</strong></td>
                </tr>
          </tbody></table></td></tr>`;
     } else if (d.type == 3) {
      html =  `
          <tr class="details"><td colspan="10"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                    <td>Комментарий клиента:</td>
                    <td>${d.client_comment}</td>
                </tr>
                <tr>
                    <td>Медаль стартовая:</td>
                    <td>
                      <div class="project-members lanes">`;
                        this.ranks.forEach(e => {
                          if(d.medal_start == e.id)
                            html += `<a href="javascript:void(0)"><span>${e.title + ' ' + e.rank}</span></a>`; 
                        });
                      html += `</div> 
                    </td>
                </tr>
                <tr>
                    <td>Медаль текущая:</td>
                    <td>
                      <div class="project-members lanes">`;
                        this.ranks.forEach(e => {
                          if(d.medal_current == e.id)
                            html += `<a href="javascript:void(0)"><span>${e.title + ' ' + e.rank}</span></a>`; 
                        });
                      html += `</div> 
                    </td>
                </tr>
                <tr>
                    <td>Медаль желаемая:</td>
                    <td>
                      <div class="project-members lanes">`;
                        this.ranks.forEach(e => {
                          if(d.medal_finish == e.id)
                            html += `<a href="javascript:void(0)"><span>${e.title + ' ' + e.rank}</span></a>`; 
                        });
                      html += `</div> 
                    </td>
                </tr>
                    <td>Рангов заслужено / осталось:</td>
                    <td>
                      <div class="project-members lanes">
                      <strong>
                      ${this.ranks.filter(e => e.id >= d.medal_start && e.id <= d.medal_current).length} /
                      ${this.ranks.filter(e => e.id >= d.medal_current && e.id <= d.medal_finish).length} 
                      </strong>
                      </div> 
                    </td>
                </tr>
          </tbody></table></td></tr>`;
     } else {
      html =  `
          <tr class="details"><td colspan="10"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                    <td>Удобное время игры:</td>
                    <td>${moment(d.training_time_from).format('D.MM.YYYY HH:mm') + ' - ' + moment(d.training_time_till).format('D.MM.YYYY HH:mm')}</td>
                </tr>
                <tr>
                    <td>Часов сыграно / осталось:</td>
                    <td>${d.training_hours_done} / ${d.training_hours - d.training_hours_done}</td>
                </tr>`;

                this.services.forEach((e) => {
                  html += `<tr>
                      <td>${e.name}:</td>
                      <td>${d.training_services.includes(e.id) ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>'}</td>
                  </tr>`;
                });

        html += `<tr>
                    <td>Комментарий клиента:</td>
                    <td>${d.client_comment}</td>
                </tr>
        </tbody></table></td></tr>`;
     }

     return html;
  }
}
