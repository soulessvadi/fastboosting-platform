import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";

import "summernote/dist/summernote.min.js";

@Directive({
  selector: "[summernote]"
})
export class SummernoteDirective implements OnInit {
  @Input() summernote = {};
  @Input() placeholder:string = null;
  @Input() content:string = null;
  @Output() change = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    $(this.el.nativeElement).summernote(
      Object.assign(this.summernote, {
        tabsize: 2,
        placeholder: this.placeholder,
        callbacks: {
          onChange: (contents, $editable) => {
            this.change.emit(contents);
          }
        }
      })
    );
    if(this.content) $(this.el.nativeElement).summernote('code', this.content);
  }
}
