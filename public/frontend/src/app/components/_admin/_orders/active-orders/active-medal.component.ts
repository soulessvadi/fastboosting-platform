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
    private datePipe: DatePipe, 
    private modalService: BsModalService, 
    private el: ElementRef,
  ) { }

  ngOnInit() { 
    this.findMedals();
    this.joinChat(this.order.system_number);
    this.progress = this.getProgress();
  }

  ngOnDestroy() {
    this.leaveChat(this.order.system_number);
  }

  public findMedals() {
    this.order.medal_c = this.properties.ranks.find(e => e.id == this.order.medal_current);
    this.order.medal_f = this.properties.ranks.find(e => e.id == this.order.medal_finish);
    this.order.medal_s = this.properties.ranks.find(e => e.id == this.order.medal_start);
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
