import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'orders-history-list',
  templateUrl: './history.component.html',
})

export class HistoryComponent implements OnInit {

  public orders: any = [];
  public orders_types: any = [];
  public orders_types_visible: any = [];
  public lanes: any = [];
  public servers: any = [];
  public ranks: any = [];
  public services: any = [];

  constructor(public _service: ComponentService, private datePipe: DatePipe) {
    this._service._history_orders.then(results => {
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

  typeSwitch(event, id) {
    if(event.target.checked) this.orders_types_visible.push(id);
    else this.orders_types_visible = this.orders_types_visible.filter((e) => e != id );
    this.orders = this._service.history_orders.filter((e) => {
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
          <tr class="details"><td colspan="10"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                  <td>Выбор героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes && d.heroes.length) {
                      d.heroes.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
                <tr>
                  <td>Бан героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes_ban && d.heroes_ban.length) {
                      d.heroes_ban.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
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
                    <td><strong>${d.mmr_finish - (d.mmr_start + d.mmr_boosted)} / ${(d.mmr_finish - (d.mmr_start + d.mmr_boosted))/25}</strong></td>
                </tr>
          </tbody></table></td></tr>`;
     } else if (d.type == 2) {
      html =  `
          <tr class="details"><td colspan="10"><table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed"><tbody>
                <tr>
                  <td>Выбор героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes && d.heroes.length) {
                      d.heroes.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
                <tr>
                  <td>Бан героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes_ban && d.heroes_ban.length) {
                      d.heroes_ban.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
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
                  <td>Выбор героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes && d.heroes.length) {
                      d.heroes.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
                <tr>
                  <td>Бан героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes_ban && d.heroes_ban.length) {
                      d.heroes_ban.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
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
                  <td>Выбор героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes && d.heroes.length) {
                      d.heroes.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
                <tr>
                  <td>Бан героев:</td>
                  <td>
                    <div class="project-members heroes">`;
                    if(d.heroes_ban && d.heroes_ban.length) {
                      d.heroes_ban.forEach(e => {
                          html += `<a href="javascript:void(0)">
                            <img src="${ this._service.store_heroes + e }_sm.png" class="online" alt="hero_${e}">
                          </a>`; 
                      });
                    } else {
                          html += `<span>Не выбрано</span>`; 
                    }
                    html += `</div> 
                  </td>
                </tr>
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
