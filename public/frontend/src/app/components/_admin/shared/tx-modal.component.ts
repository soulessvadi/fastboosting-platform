import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'tx-modal',
  templateUrl: './tx-modal.component.html',
})

export class TxModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Input() tx;
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
    if(this.tx) this.tx.amount = Math.abs(this.tx.amount);
  }

  send() {
    if(this.tx.type == 3 || this.tx.type == 4) this.tx.amount = 0 - Math.abs(this.tx.amount);
    this._service.saveTx(this.tx.id, this.tx).subscribe(res => {
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
