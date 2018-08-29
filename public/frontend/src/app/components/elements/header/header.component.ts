import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ComponentService } from '@app/components/components.service';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public _service: ComponentService) {
  }

  ngOnInit() {
  }


  searchMobileActive = false;

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }
}
