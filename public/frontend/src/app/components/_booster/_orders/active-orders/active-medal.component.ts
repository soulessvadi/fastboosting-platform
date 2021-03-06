import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '@app/components/components.service';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationService } from '@app/core/services';
import * as moment from 'moment';

@Component({
  selector: 'active-medal',
  templateUrl: './active-medal.component.html',
})

export class MedalComponent implements OnInit, OnDestroy {

  @Output() quit = new EventEmitter<any>();
  @Output() status = new EventEmitter<any>();
  @Output() dotabuff = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();
  @Input() order;
  @Input() properties;
  private bsModalRef: BsModalRef;
  public tabs: any = { active: 0 };
  public chart: any = { options: null, data: null };
  public progress: number = 0;
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
    private datePipe: DatePipe, 
    private modalService: BsModalService, 
    private el: ElementRef,
  ) { }

  ngOnInit() { 
    this.order.medal_c = this.properties.ranks.find(e => e.id == this.order.medal_current);
    this.order.medal_f = this.properties.ranks.find(e => e.id == this.order.medal_finish);
    this.order.medal_s = this.properties.ranks.find(e => e.id == this.order.medal_start);
    this.joinChat(this.order.system_number);
    this.progress = this.getProgress();
    let events = [{
      "id": this.order.system_number,
      "title": "#"+this.order.system_number,
      "start": moment(this.order.created_at).local(),
      "end": moment(this.order.deadline).local(),
      "icon": "fas fa-plus",
      "className": ["event","fs-14"]
    }];
    this.renderCalendar(events);
  }

  ngOnDestroy() {
    this.leaveChat(this.order.system_number);
    this.fullcalendar.fullCalendar("destroy");
  }

  private $calendarRef;
  private fullcalendar;
  private renderCalendar(events) {
    require("script-loader!smartadmin-plugins/bower_components/fullcalendar/dist/fullcalendar.min.js");
    let locale = this._service.locale == 'us' ? 'en' : 'ru';
    this.$calendarRef = $(document.getElementById("calendar"));
    this.fullcalendar = this.$calendarRef.fullCalendar({
      lang: locale,
      displayEventEnd: true,
      timeFormat: 'DD.MM.YYYY hh:mm',
      eventBackgroundColor: '#4c004e',
      aspectRatio: 2.7,
      editable: true,
      draggable: true,
      selectable: false,
      selectHelper: true,
      unselectAuto: false,
      disableResizing: false,
      droppable: true,
      header: { left: "title", center: "prev, next, today", right: "month"},
      select: (start, end, allDay) => {
        var title = prompt("Event Title:");
        if (title) {
          this.fullcalendar.fullCalendar("renderEvent", {
            title: title,
            start: start,
            end: end,
            allDay: allDay
          }, true );
        }
        this.fullcalendar.fullCalendar("unselect");
      },
      events: (start, end, timezone, callback) => {
        callback(events);
      },
      eventRender: (event, element, icon) => {
        if (event.description !== "")
          element.find(".fc-event-title").append("<br/><span class='ultra-light'>" + event.description + "</span>");
        if (event.icon !== "")
          element.find(".fc-event-title").append("<i class='air air-top-right fa " + event.icon + " '></i>");
      }
    });

    $(".fc-header-right, .fc-header-center", this.$calendarRef).hide();

    $(".fc-left", this.$calendarRef).addClass("fc-header-title");
  }

  public next() {
    $(".fc-next-button", this.el.nativeElement).click();
  }

  public prev() {
    $(".fc-prev-button", this.el.nativeElement).click();
  }

  public today() {
    $(".fc-today-button", this.el.nativeElement).click();
  }

  public changeStatus() {
    this.status.emit(true);
  }

  public quitOrder() {
    this.quit.emit(true);
  }

  public setDotabuff(e) {
    this.dotabuff.emit(e);
  }

  public reportSaved(response) {
    this.report.emit(response);
    if(response.report) {
      this.order.medal_current = response.report.medal;
      this.order.medal_c = this.properties.ranks.find(e => e.id == this.order.medal_current);
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
    let medals_total = this.properties.ranks.filter(e => e.id >= this.order.medal_start && e.id <= this.order.medal_finish);
    let medals_done = this.properties.ranks.filter(e => e.id >= this.order.medal_start && e.id <= this.order.medal_current);
    let totalval = medals_total.length;
    let doneval = medals_done.length;
    let progress = 100 / totalval * doneval;
    return Math.round(progress);
  }

  public openModal(event, template: TemplateRef<any>) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  public modalClose() {
    this.bsModalRef.hide();
  }
}
