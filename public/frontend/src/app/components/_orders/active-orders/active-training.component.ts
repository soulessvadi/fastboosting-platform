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
  selector: 'active-training',
  templateUrl: './active-training.component.html',
})

export class TrainingComponent implements OnInit, OnDestroy {

  @Output() quit = new EventEmitter<any>();
  @Output() status = new EventEmitter<any>();
  @Output() dotabuff = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();
  @Input() order;
  @Input() properties;
  private bsModalRef: BsModalRef;
  public tabs: any = { active: 0 };
  public progress: number = 0;
  public chat = {
    message:'',
    unread:0,
    messages:[]
  };
  public timer = {
    h: '00',
    m: '00',
    s: '00',
    paused: true,
    stopped: false,
  }

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
    this.joinChat(this.order.system_number);
    this.progress = this.getProgress();
  }

  ngOnDestroy() {
    this.leaveChat(this.order.system_number);
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
      this.order.training_hours_done += response.report.hours;
    }
    this.progress = this.getProgress();
  }

  public pause(): void {
    if(this.timer.paused)
      this.socketio.emit(SocketEvent.ORDERCOUNTDOWNSTART, {room:this.order.system_number}); 
    else
      this.socketio.emit(SocketEvent.ORDERCOUNTDOWNPAUSE, {room:this.order.system_number}); 
  }

  private joinChat(room): void {
    this.socketio.emit(SocketEvent.JOIN, { room:room, nick_name:this._service.user.nick_name });
    this.socketio.onEvent(SocketEvent.ORDERMSG).subscribe((message) => {
      if(message.user.id != this._service.user.id) ++this.chat.unread;
      this.chat.messages.push(message);
      this.scrollChat();
    });
    this.socketio.onEvent(SocketEvent.ORDERCOUNTDOWN).subscribe((res) => {
        this.timer = res;
    }); 
    this.socketio.onEvent(SocketEvent.ROOMJOINED).subscribe((res) => {
        console.log(res.nick_name + ' joined chat');
    }); 
    this.socketio.onEvent(SocketEvent.ROOMMSGS).subscribe((res) => {
      this.chat.messages = res;
    });      
  }

  private leaveChat(room): void {
    this.socketio.removeEvent(SocketEvent.ORDERMSG, SocketEvent.ROOMJOINED, SocketEvent.ROOMMSGS, SocketEvent.ORDERCOUNTDOWN);
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
}
