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
    this.socketio.onEvent(SocketEvent.AUTHFAILURE).subscribe((data) => {
      if(this.authcheckenabled) {
        _service.logout();
        router.navigate(['auth/login']);
      }
    });
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let url = event.url.split("/").filter(e => e && e != "");
          if(url.includes('auth'))
            self.authcheckenabled = false;
          else 
            self.authcheckenabled = true;
        }
    });
	}
}
