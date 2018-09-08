import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, AfterContentInit, Renderer2, Input } from '@angular/core';
import { Router} from "@angular/router";
import { LayoutService } from "@app/core/services/layout.service";
import { ComponentService } from "@app/components/components.service";
import { trigger, state, style, transition, animate} from '@angular/animations'

@Component({
  selector: 'sa-shortcut',
  templateUrl: './shortcut.component.html',
  animations: [
    trigger('shortcutState', [
      state('out', style({
        height: 0,
      })),
      state('in', style({
        height: '*',
      })),
      transition('out => in', animate('250ms ease-out')),
      transition('in => out', animate('250ms 300ms ease-out'))
    ])
  ]
})
export class ShortcutComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  public state:string = 'out';
  private layoutSub:Subscription;
  private documentSub:any;
  @Input('shortcuts') shortcuts: any; 

  constructor(private layoutService:LayoutService,
              private router:Router,
              private renderer:Renderer2,
              private el:ElementRef,
              public _service:ComponentService) {
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

  shortcutTo(route) {
    this.router.navigate(route);
    this.layoutService.onShortcutToggle(false);
  }

  ngOnInit() {
  }

  public colorify() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  listen() {
    this.layoutSub = this.layoutService.subscribe((store)=> {
      this.state = store.shortcutOpen ? 'in' : 'out'

      if (store.shortcutOpen) {
        this.documentSub = this.renderer.listen('document', 'mouseup', (event) => {
          if (!this.el.nativeElement.contains(event.target)) {
            this.layoutService.onShortcutToggle(false);
            this.documentUnsub()
          }
        });
      } else {
        this.documentUnsub()
      }
    })
  }

  ngAfterContentInit() {
    this.listen()

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.layoutSub.unsubscribe();
  }


  documentUnsub() {
    this.documentSub && this.documentSub();
    this.documentSub = null
  }

}
