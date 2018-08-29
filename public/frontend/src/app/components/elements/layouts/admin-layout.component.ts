import { Component, OnInit, AfterViewInit } from "@angular/core";
import { routerTransition } from "@app/shared/utils/animations";
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styles: [],
  animations: [routerTransition]
})
export class AdminLayoutComponent implements AfterViewInit {

  public loading;
  constructor(private router: Router) {
      this.loading = false;
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
        if(event instanceof NavigationStart) {
            this.loading = true;
        } else if ( event instanceof NavigationEnd || event instanceof NavigationCancel) {
            setTimeout(() => {this.loading = false;}, 100);
        }
    });
  }

  getState(outlet) {
    if(!outlet.activatedRoute) return;
    let ss = outlet.activatedRoute.snapshot;

    // return unique string that is used as state identifier in router animation
    return (
      outlet.activatedRouteData.state ||
      (ss.url.length
        ? ss.url[0].path
        : ss.parent.url.length
          ? ss.parent.url[0].path
          : null)
    );
  }
}
