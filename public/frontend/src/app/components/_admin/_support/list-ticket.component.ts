import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './list-ticket.component.html',
})

export class TicketComponent implements OnInit, OnDestroy {

  public chat = {
    room: null,
    messages: null,
    message: null,
    unread: 0,
  };
  public system_number: string;
  public ticket: any = null;
  public authors: any = [];
  public statuses: any = [];
  public types: any = [];
  public activeTab = 1;
  public responseMessage = null;
  public responseSuccess = false;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.system_number = this.route.snapshot.paramMap.get('ticket');
    this._service._tickets_statuses.then(res => this.statuses = res);
    this._service._tickets_types.then(res => this.types = res);
    this.fetch();
  }

  ngOnDestroy() {
    this.leaveChat();
  }

  private leaveChat() {
    this.socketio.emit(SocketEvent.LEAVE, {room:this.chat.room});
    this.socketio.removeEvent(SocketEvent.ROOMMSG,SocketEvent.ROOMJOINED,SocketEvent.ROOMMSGS);
    this.chat.room = null;
    this.chat.messages = null;
    this.chat.message = null;
  }

  public getUserName() {
    let author = this.authors.find(e => e.id == this.ticket.user_id);
    return author ? author.nick_name : '';
  }

  private joinToChat(): void {
    this.socketio.initSocket();
    if(this.chat.room) this.socketio.emit(SocketEvent.LEAVE, {room:this.chat.room});
    this.socketio.emit(SocketEvent.JOIN, {room:this.chat.room,nick_name:this._service.user.nick_name});
    this.socketio.onEvent(SocketEvent.ROOMMSG)
      .subscribe((message) => {
        if(message.user.id != this._service.user.id && this.activeTab != 2) ++this.chat.unread;
        this.chat.messages.push(message);
        this.scrollChat();
    });
    this.socketio.onEvent(SocketEvent.ROOMJOINED)
    .subscribe((res) => {
        console.log(res.nick_name + ' joined');
    }); 
    this.socketio.onEvent(SocketEvent.ROOMMSGS)
    .subscribe((res) => {
        this.chat.messages = res;
    });      
      
  }

  public sendMessage(event): void {
    event.preventDefault();
    if (!this.chat.message) { return; }
    this.socketio.emit(SocketEvent.ROOMMSG, {
      user: { 
        avatar: this._service.store_avatars + this._service.user.avatar, 
        name: this._service.user.nick_name, 
        id: this._service.user.id 
      },
      text: this.chat.message,
      date: new Date,
      room: this.chat.room,
    });
    this.chat.message = '';
  }

  private scrollChat() {
    let $body = $('#chat-body', this.el.nativeElement);
    $body.animate({scrollTop: $body[0].scrollHeight});
  }

  public save() {
    $('#save-btn').addClass('loading');
    this._service.saveTicket(this.ticket.system_number, this.ticket).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { $('#save-btn').removeClass('loading'); this.responseMessage = null; }, 1000);
    })
  }

  public fetch() {
    this._service.getTicketByNumber(this.system_number).subscribe((res: any) => {
      this.ticket = res.body.ticket;
      this.authors = res.body.authors;
      if(!this.ticket) {
        this.router.navigate(['/gowt/sundry/404']);
      } else {
        this.chat.room = this.system_number;
        this.joinToChat();
      }
    })
  }
}
