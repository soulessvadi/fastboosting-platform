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

  constructor(private layoutService: LayoutService, public _service: ComponentService) {
  	_service.menu().subscribe((res: any) => {
  		this.menus = res.body.list;
  	});
  }

  ngOnInit() {

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle();
  }

}
