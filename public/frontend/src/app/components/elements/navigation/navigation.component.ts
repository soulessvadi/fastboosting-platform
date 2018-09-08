import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})

export class NavigationComponent implements OnInit {

  public devMenu = 0;
  public menus = null;
  public shortcuts = [];

  constructor(private layoutService: LayoutService, public _service: ComponentService) {}

  ngOnInit() {
    this._service.menu().subscribe((res: any) => {
      this.menus = res.body.list;
      this.menus.forEach(e => {
        e.nestings.forEach(c => {
          if(c.shortcut) {
            c.color = this._service.colorify();
            this.shortcuts.push(c);
          }
        })
      })
    });
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle();
  }

}
