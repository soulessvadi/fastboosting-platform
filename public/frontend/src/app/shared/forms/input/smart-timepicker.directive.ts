import {Directive, ElementRef, OnInit, Output, EventEmitter} from '@angular/core';


@Directive({
  selector: '[smartTimepicker]'
})
export class SmartTimepickerDirective implements OnInit{

  @Output() change = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit(){
    import('bootstrap-timepicker/js/bootstrap-timepicker.min.js').then(()=>{
      this.render()
    })
  }

  render() {
    var self = this;
    $(this.el.nativeElement).timepicker({
      showSeconds: true,
      showMeridian: false,
    });
    $(this.el.nativeElement).on('changeTime.timepicker', function(e) {
      self.change.emit(e.time);
    });
  }
}
