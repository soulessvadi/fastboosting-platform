import {Component, OnInit, Input} from '@angular/core';

@Component({

  selector: 'sa-big-breadcrumbs',
  template: `
    <div>
    <h1 class="page-title txt-color-blueDark">
    <i class="fa-fw {{icon}}"></i> {{items[0]}} 
    <span *ngFor="let item of items.slice(1)">> {{item}} </span>
    <button class="btn btn-icon"><i class="fas fa-undo-alt"></i></button>
    </h1>
    </div>
  `,
})

export class BigBreadcrumbsComponent implements OnInit {

  @Input() public icon: string;
  @Input() public items: Array<string>;


  constructor() {}

  ngOnInit() {
  }

}
