import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
})

export class RepliesComponent implements OnInit {

  @Input() tickets:any = {};

  constructor() {

  }

  ngOnInit() {

  }

}
