import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@app/core/services';

@Component({
  selector: 'orders-list',
  templateUrl: './list.component.html',
})

export class ListComponent implements OnInit {

  public orders: any = [];
  public orders_types: any = [];
  public orders_types_visible: any = [];
  public lanes: any = [];
  public servers: any = [];
  public ranks: any = [];
  public services: any = [];

  constructor(public _service: ComponentService, private router: Router, private datePipe: DatePipe, private notificationService: NotificationService) {
    this._service._accessible_orders.then(results => {
      this.orders = results;
      this.orders_types = this._service.orders_types;
      this.lanes = this._service.lanes;
      this.servers = this._service.servers;
      this.ranks = this._service.ranks;
      this.services = this._service.services;
    }).catch(e => {})
  }

  ngOnInit() {

  }

  public joinOrder(order) {
    let type = this.orders_types.find(e => e.id == order.type);
    this.notificationService.smartMessageBox({
      title: !this._service._user.is_busy 
        ? `<strong class='txt-color-blue'>${this._service.user.nick_name}</strong> вы хотите приступить к работе над заказом #${order.system_number}?`
        : `<strong class='txt-color-blue'>${this._service.user.nick_name}</strong> вы не можете брать заказ пока не завершите текущий`,
      content: !this._service._user.is_busy ? `${type.name} - ${parseInt(order.amount)} руб.` : ``,
      buttons: !this._service._user.is_busy ? "[Нет][Да]" : "[Закрыть]",
    }, (button, comment) => {
      if(button == "Нет" || this._service._user.is_busy) return 0;
      this._service.joinOrder({id: order.system_number}).subscribe(res => {
        if(res.status == 200) {
          let user = this._service._user;
          user.is_busy = true;
          user.active_order =  order.system_number;
          this._service._user = user;
          this.router.navigate(['/orders/active']);
        }
      });
    });
  }

  getDeadline(hours) {
    let date = new Date();
    date.setHours( date.getHours() + hours );
    return hours ? this.datePipe.transform(date, 'd.MM.yyyy HH:mm') : '-';
  }

  typeSwitch(event, id) {
    if(event.target.checked) this.orders_types_visible.push(id);
    else this.orders_types_visible = this.orders_types_visible.filter((e) => e != id );
    this.orders = this._service.accessible_orders.filter((e) => {
      return this.orders_types_visible.length ? this.orders_types_visible.includes(e.type) : true;
    });
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
          <tr class="details"><td colspan="9"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
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
          <tr class="details"><td colspan="9"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
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
          <tr class="details"><td colspan="9"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
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
          <tr class="details"><td colspan="9"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                    <td>Удобное время игры:</td>
                    <td>${this.datePipe.transform(d.training_time_from, 'd.MM.yyyy HH:mm') + ' - ' + this.datePipe.transform(d.training_time_till, 'd.MM.yyyy HH:mm')}</td>
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
