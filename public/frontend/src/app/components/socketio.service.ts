import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'ws://localhost:4001';

export interface Message {
    user: { avatar: string, name: string, id: number },
    text: string,
    date: string,
    room?: any,
}

export enum SocketEvent {
    CONNECT = 'user connected',
    DISCONNECT = 'disconnect',
    AUTHFAILURE = 'property failure',
    ORDERCOUNTDOWNGET = 'order countdown get',
    ORDERCOUNTDOWNSET = 'order countdown set',
    ORDERCOUNTDOWN = 'order countdown',
    ORDERCOUNTDOWNSTART = 'order countdown start',
    ORDERCOUNTDOWNSTOP = 'order countdown stop',
    ORDERCOUNTDOWNPAUSE = 'order countdown pause',
    MESSAGE = 'message',
    THIS = 'this',
    JOIN = 'join room',
    LEAVE = 'leave room',
    ORDERMSG = 'order message',
    ROOMJOINED = 'room joined',
    ROOMMSG = 'room message',
    ROOMMSGS = 'room messages',
    NOTIFICATIONS = 'user notifications',
    NTFNEWS = 'notification news',
    NTFREMINDERS = 'notification reminders',
    NTFMESSAGES = 'notification messages',
}

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    public socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public connect(): void {
        if(!this.socket) this.socket = socketIo(SERVER_URL);
    }

    public emit(event, data): void {
        this.socket.emit(event, data);
    }

    public send(message: Message): void {
        this.socket.emit(SocketEvent.MESSAGE, message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on(SocketEvent.MESSAGE, (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: SocketEvent): Observable<any> {
        return new Observable<SocketEvent>(observer => {
            this.socket.on(event, (data) => observer.next(data));
        });
    }

    public removeEvent(...events: SocketEvent[]): void {
        for(let event of events) this.socket.off(event);
    }

}