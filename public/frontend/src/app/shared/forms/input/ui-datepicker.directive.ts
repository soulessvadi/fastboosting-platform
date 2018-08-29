import {Directive, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[saUiDatepicker]'
})
export class UiDatepickerDirective implements OnInit {

  @Input() saUiDatepicker:any;
  @Output() change = new EventEmitter();

  constructor(private el:ElementRef) {
  }

  ngOnInit() {
    let onSelectCallbacks = [];
    let saUiDatepicker = this.saUiDatepicker || {};
    let element = $(this.el.nativeElement);

    if (saUiDatepicker.minRestrict) {
      onSelectCallbacks.push((selectedDate)=> {
        $(saUiDatepicker.minRestrict).datepicker('option', 'minDate', selectedDate);
      });
    }
    if (saUiDatepicker.maxRestrict) {
      onSelectCallbacks.push((selectedDate)=> {
        $(saUiDatepicker.maxRestrict).datepicker('option', 'maxDate', selectedDate);
      });
    }

    //Let others know about changes to the data field
    onSelectCallbacks.push((selectedDate) => {
      element.triggerHandler("change"); 
      this.change.emit(selectedDate);       

      let form = element.closest('form');

      if (typeof form.bootstrapValidator == 'function') {
        try {
          form.bootstrapValidator('revalidateField', element);
        } catch (e) {
          console.log(e.message)
        }
      }
    });

    let options = $.extend(saUiDatepicker, {
      prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
      onSelect: (selectedDate) =>{
        onSelectCallbacks.forEach((callback) =>{
          callback.call(callback, selectedDate)
        })
      }
    });

    element.datepicker(options);


  }


}
