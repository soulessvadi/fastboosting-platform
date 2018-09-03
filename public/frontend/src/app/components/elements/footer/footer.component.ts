import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sa-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {

  public last_activity = new Date();

  constructor() {
    setInterval(() => {
      let update = this.last_activity.toString();
      this.last_activity = new Date(update);
    }, 30000);
  }

  ngOnInit() {
  	var self = this;
	  document.addEventListener('click', function (event) {
		self.last_activity = new Date();
	}, false);
  }

}
