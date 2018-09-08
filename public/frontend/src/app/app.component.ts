import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SocketService, SocketEvent } from '@app/components/socketio.service'
import { ComponentService } from '@app/components/components.service'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})

export class AppComponent {
  public authcheckenabled = false;
	constructor(private socketio: SocketService, private _service: ComponentService, private router: Router, private route: ActivatedRoute) {
    var self = this;
		this.socketio.connect();
    this.socketio.emit(SocketEvent.CONNECT, { t: this._service._token });
    /* ban check */ 
    this.socketio.onEvent(SocketEvent.AUTHLOCKED).subscribe((data) => {
      this._service.smallBox({
        title: "Уведомление",
        content: "Ваш аккаунт был заблокирован",
        color: "#df4a3a",
        icon: "fas fa-ban bounce animated",
        iconSmall: false,
        timeout: 300000
      });
      router.navigate(['/auth/locked/' + this._service._user.id]); 
      this._service.logout();
    });
    /* authorization sanity failure */ 
    this.socketio.onEvent(SocketEvent.AUTHFAILURE).subscribe((data) => {
      if(this.authcheckenabled) {
        this._service.smallBox({
          title: "Уведомление",
          content: "Ваша сессия истекла",
          color: "#df4a3a",
          icon: "fas fa-sign-out-alt bounce animated",
          iconSmall: false,
          timeout: 300000
        });
        this._service.logout();
        router.navigate(['/auth/login']);
      }
    });
    /* authorization sanity on every page trigger */ 
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.socketio.emit(SocketEvent.AUTHCHECK, { t: this._service._token });
          let url = event.url.split("/").filter(e => e && e != "");
          if(url.includes('auth'))
            self.authcheckenabled = false;
          else 
            self.authcheckenabled = true;
        }
    });
	}
}
