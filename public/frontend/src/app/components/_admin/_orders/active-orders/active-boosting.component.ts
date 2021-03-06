import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationService } from '@app/core/services';
import * as moment from 'moment';

@Component({
  selector: 'active-boosting',
  templateUrl: './active-boosting.component.html',
})

export class BoostingComponent implements OnInit, OnDestroy {

  @Output() quit = new EventEmitter<any>();
  @Output() status = new EventEmitter<any>();
  @Output() dotabuff = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();
  @Input() order;
  @Input() properties;
  public heroes: any = [];
  public heroesBan: any = [];
  public servers: any = [];
  public lanes: any = [];
  public lanes_checked = [];
  private bsModalRef: BsModalRef;
  public tabs: any = { active: 0 };
  public chart: any = { options: null, data: null };
  public progress: number = 0;
  public responseMessage = null;
  public chat = {
    message:'',
    unread:0,
    messages:[]
  };

  constructor(
    public _service: ComponentService, 
    private router: Router,
    private notificationService: NotificationService,
    private socketio: SocketService, 
    private modalService: BsModalService, 
    private el: ElementRef,
  ) { }

  ngOnInit() { 
    this.renderChart();
    this.joinChat(this.order.system_number);
    this.progress = this.getProgress();
    if(!this.order.heroes) this.order.heroes = [];
    if(!this.order.heroes_ban) this.order.heroes_ban = [];
    if(!this.order.lanes) this.order.lanes = [];
    if(!this.order.servers) this.order.servers = [];
    this.order.deadlinef = moment(this.order.deadline).format('DD.MM.YYYY');

    this._service._heroes.then((heroes: any) => this.heroes = heroes);
    this._service._lanes.then((lanes: any) => this.lanes = lanes);
    this._service._servers.then((servers: any) => this.servers = servers);
  }

  ngOnDestroy() {
    this.leaveChat(this.order.system_number);
  }

  public changeStatus() {
    this.status.emit(true);
  }

  public save() {
    $('#save-btn').addClass('loading');
    this._service.saveOrder(this.order.system_number, this.order).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { $('#save-btn').removeClass('loading'); this.responseMessage = null; }, 1000);
    })
  }

  public heroesChanged(hero) {
    if(hero.checked) 
      this.order.heroes.push(hero.id);
    else if (this.order.heroes.indexOf(hero.id) !== -1)
      this.order.heroes.splice(this.order.heroes.indexOf(hero.id), 1);
  }

  public heroesBanChanged(hero) {
    if(hero.checked) 
      this.order.heroes_ban.push(hero.id);
    else if (this.order.heroes_ban.indexOf(hero.id) !== -1)
      this.order.heroes_ban.splice(this.order.heroes_ban.indexOf(hero.id), 1);
  }

  public lanesChanged(lane) {
    if(lane.checked) this.order.lanes.push(lane.id);
    else this.order.lanes = this.order.lanes.filter(e => e != lane.id);
  }

  public serversChanged(server) {
    if(server.checked) this.order.servers.push(server.id);
    else this.order.servers = this.order.servers.filter(e => e != server.id);
  }

  public reportSaved(response) {
    this.report.emit(response);
    if(response.report) {
      this.order.mmr_boosted = response.report.mmr - this.order.mmr_start;
      this.chart.data = null;
      setTimeout(() => { this.renderChart(); }, 150);
    }
    this.progress = this.getProgress();
  }

  private joinChat(room): void {
    this.socketio.emit(SocketEvent.JOIN, {room:room,nick_name:this._service.user.nick_name});
    this.socketio.onEvent(SocketEvent.ORDERMSG).subscribe((message) => {
      if(message.user.id != this._service.user.id) ++this.chat.unread;
      this.chat.messages.push(message);
      this.scrollChat();
    });
    this.socketio.onEvent(SocketEvent.ROOMJOINED).subscribe((res) => {
        console.log(res.nick_name + ' joined chat');
    }); 
    this.socketio.onEvent(SocketEvent.ROOMMSGS).subscribe((res) => {
      this.chat.messages = res;
    });      
  }

  private leaveChat(room): void {
    this.socketio.removeEvent(SocketEvent.ORDERMSG, SocketEvent.ROOMJOINED, SocketEvent.ROOMMSGS);
    this.socketio.emit(SocketEvent.LEAVE, {room:room});
  }

  public sendMessage(event): void {
    event.preventDefault();
    if (!this.chat.message) { return; }
    this.socketio.emit(SocketEvent.ORDERMSG, {
      user: { 
        avatar: this._service.store_avatars + this._service.user.avatar, 
        name: this._service.user.nick_name, 
        id: this._service.user.id 
      },
      text: this.chat.message,
      date: new Date,
      room: this.order.system_number,
    });
    this.chat.message = '';
  }

  private scrollChat() {
    let $body = $('#chat-body', this.el.nativeElement);
    if($body.length) $body.animate({scrollTop: $body[0].scrollHeight});
  }

  public getProgress() {
    let progress;
    if(this.order.type == 1) {
      let totalval = this.order.mmr_finish - this.order.mmr_start;
      let doneval = this.order.mmr_boosted;
      progress = 100 / totalval * doneval;
    }
    return Math.round(progress);
  }

  public openModal(event, template: TemplateRef<any>) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  public modalClose() {
    this.bsModalRef.hide();
  }

  public setDeadline($event) {
    this.order.deadline = moment($event, 'DD.MM.YYYY').toISOString();
  }

  private renderChart() {
    let mmrstart, mmrasc, datasets = [], datasets2 = [];
    let dates = this._service.getDatesRange(this.order.created_at, this.order.deadline);
    if(dates.length < 2) dates = [this.order.created_at, this.order.deadline];
    dates.forEach((date, index) => {
      let reports = this.order.reports.filter(e =>  moment(date).format('DD.MM.YYYY') == moment(e.created_at).format('DD.MM.YYYY'));
      let mmr = reports.length ? parseInt(reports[0].mmr) : (!index ? this.order.mmr_start : ( datasets[index - 1] > 0 ? datasets[index - 1] : 0));
      datasets.push(mmr);
    });

    this.chart.data = {
      labels: dates.map(e => moment(e).format('DD.MM.YY')),
      datasets: [{
        data: datasets,
        backgroundColor: "rgba(150, 180, 71, 0.2)",
        borderColor: "rgba(150, 180, 71, 1)",
        borderWidth: 2,
        tension: 0,
        pointBackgroundColor: "rgba(251, 60, 74, 1)"
      }]
    };

    this.chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: { 
        mode: 'nearest',
        displayColors: false,
        titleFontSize: 14,
        bodyFontSize: 11,
        callbacks: {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']] + " MMR";
          }
        }
      },
      hover: { mode: 'dataset' },
      legend: { display: false },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            show: false,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            min: 0,
            suggestedMin: 0,
            beginAtZero: true,
            callback: function(value, index, values) {
              if (Math.floor(value) === value) return value;
            }
          },
          scaleLabel: {
            show: false,
            labelString: 'Data'
          }
        }]
      },
    };
  }
}
