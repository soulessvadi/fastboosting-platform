import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'tx-new-modal',
  templateUrl: './tx-new-modal.component.html',
})

export class NewTxModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() types;
  @Input() currencies;
  @Input() statuses;


  @ViewChild('form') form;
  @ViewChild('message') message;

  public responseMessage = null;
  public responseSuccess = false;

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {

  }

  send() {
    this._service.saveTx(1, {}).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.responseMessage = 'Сохранено', this.responseSuccess = true;
        setTimeout(() => {
          this.close.emit(true);
        }, 1500);
      } else {
        this.responseMessage = 'Возникли проблемы. Попробуйте позже.';
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
        }, 1500);
      }
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Возникли проблемы. Попробуйте позже.';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
      }, 1500);
    });
  }

}
