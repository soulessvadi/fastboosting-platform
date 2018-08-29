import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './list-ticket.component.html',
})

export class TicketComponent implements OnInit {

  @ViewChild('chatWindow') chatWindow;
  public chat = {
    room: null,
    messages: null,
    message: null,
  };
  public system_number;
  public tickets;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.system_number = this.route.snapshot.paramMap.get('ticket');
    this.fetch();
  }

  ngOnInit() {
    
  }

  private leaveChat() {
    this.socketio.emit(SocketEvent.LEAVE, {room:this.chat.room});
    this.chat.room = null;
    this.chat.messages = null;
    this.chat.message = null;
  }

  private joinToChat(): void {
    this.socketio.initSocket();
    if(this.chat.room) this.socketio.emit(SocketEvent.LEAVE, {room:this.chat.room});
    this.socketio.emit(SocketEvent.JOIN, {room:this.chat.room,nick_name:this._service.user.nick_name});
    this.socketio.onEvent(SocketEvent.ROOMMSG)
      .subscribe((message) => {
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

  public fetch() {
    this._service.getSelfTickets({number: this.system_number}).subscribe(res => {
      this.tickets = res.body.tickets;
      if(!this.tickets.length) {
        this.router.navigate(['/support/issues']);
      } else {
        this.chat.room = this.system_number;
        this.joinToChat();
      }
    })
  }
}
