import {Directive, ElementRef, OnInit, Output, EventEmitter} from '@angular/core';

import 'script-loader!ion-rangeslider/js/ion.rangeSlider.min.js'

@Directive({
  selector: '[ionSlider]'
})
export class IonSliderDirective implements OnInit{

  constructor(private el: ElementRef) { }

  @Output() change = new EventEmitter();

  ngOnInit() {
  	var self = this;
    $(this.el.nativeElement).ionRangeSlider({
	    onChange: function (data) {
	        self.change.emit({from:data.from,to:data.to});
	    },
      onStart: function (data) {
          self.change.emit({from:data.from,to:data.to});
      },
    });

  }

}
