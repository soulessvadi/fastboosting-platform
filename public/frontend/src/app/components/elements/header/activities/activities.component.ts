import {Component, OnInit, ElementRef, Renderer, OnDestroy} from '@angular/core';
import {SocketService, SocketEvent} from "@app/components/socketio.service";
import {ComponentService} from "@app/components/components.service";
declare var $: any;

@Component({
  selector: 'sa-activities',
  templateUrl: './activities.component.html',
  providers: [SocketService],
})

export class ActivitiesComponent implements OnInit, OnDestroy {
  public count:number = 0;
  public lastUpdate:any = new Date();
  public active:boolean = false;
  public loading: boolean = false;
  public currentActivity = 1;
  public news: Array<any> = [];
  public reminders: Array<any> = [];
  public messages: Array<any> = [];
  private documentSub: any;

  constructor(
    private el:ElementRef,
    private renderer: Renderer,
    private socketio: SocketService,
    private _service: ComponentService,
  ) { }

  ngOnInit() {
    this.socketio.connect();  
    this.socketio.onEvent(SocketEvent.NTFNEWS).subscribe((news) => {
      this.news = news; this.countAll();
    });
    this.socketio.onEvent(SocketEvent.NTFREMINDERS).subscribe((reminders) => {
      this.reminders = reminders; this.countAll();
    });
    this.socketio.onEvent(SocketEvent.NTFMESSAGES).subscribe((messages) => {
      console.log(messages)
      this.messages = messages; this.countAll();
    });
    this.update();
  }

  private countAll() { 
    this.lastUpdate = new Date(); 
    this.count = this.news.length + this.reminders.length + this.messages.length;
  }

  public update(): void {
    this.loading = true;
    this.socketio.emit(SocketEvent.NOTIFICATIONS, {t: this._service._token});     
    setTimeout(() => { 
      this.loading = false;  
      this.countAll();
    }, 1000); 
  }

  onToggle() {
    let dropdown = $('.ajax-dropdown', this.el.nativeElement);
    this.active = !this.active;
    if (this.active) {
      dropdown.fadeIn()
      this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          dropdown.fadeOut();
          this.active = false;
          this.documentUnsub()
        }
      });
    } else {
      dropdown.fadeOut()
      this.documentUnsub()
    }
  }

  ngOnDestroy(){
    this.documentUnsub()
  }

  documentUnsub(){
    this.documentSub && this.documentSub();
    this.documentSub = null
  }

}
