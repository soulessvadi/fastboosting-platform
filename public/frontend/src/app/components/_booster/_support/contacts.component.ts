import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'sa-contacts',
  templateUrl: './contacts.component.html',
})

export class ContactsComponent implements OnInit {

  public contacts;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private el: ElementRef,
  ) {
    this._service.getContacts().subscribe(res => {
      this.contacts = res.body.contacts;
    })
  }

  ngOnInit() {

  }
}
