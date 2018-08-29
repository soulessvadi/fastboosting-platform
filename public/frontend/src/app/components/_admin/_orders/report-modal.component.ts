import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'report-modal',
  templateUrl: './report-modal.component.html',
})

export class ReportModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Output() reportSaved = new EventEmitter()
  @Input() order;
  @Input() medals;
  @ViewChild('form') form;
  @ViewChild('message') message;
  @ViewChild('screenshots') screenshots;
  public responseMessage = null;
  public responseSuccess = false;
  public report = {
    finisher: false,
    games_done: 0,
    hours_done: 0,
    mmr: 0,
    medal: 0,
    comment: '',
    screenshots: null,
  };
  public chosen_medal: any = {};

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    if(this.order.type == 3) {
      this.report.medal = this.order.medal_current;
    }
  }

  send() {
    if(this.order.type == 1 && (this.report.finisher && !this.report.screenshots)) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Заполните все обязательные поля отчета';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;
    }

    if(this.order.type == 1 && this.report.finisher && this.report.mmr < this.order.mmr_finish) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Финальный результат заказа не достигнут';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;      
    }

    if(this.order.type == 2 && (this.report.finisher && (!this.report.screenshots || !this.report.mmr))) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Заполните все обязательные поля отчета';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;
    }

    if(this.order.type == 2 && this.report.finisher && this.report.games_done < this.order.cali_games_total) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Финальный результат заказа не достигнут';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;      
    }

    if(this.order.type == 3 && this.report.finisher && this.report.medal != this.order.medal_finish) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Финальный результат заказа не достигнут';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;      
    }

    if(this.order.type == 3 && (this.report.finisher && !this.report.screenshots)) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Заполните все обязательные поля отчета';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;
    }

    if(this.order.type == 4 && (this.report.finisher && !this.report.screenshots)) {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Заполните все обязательные поля отчета';
      setTimeout(() => { this.form.nativeElement.classList.remove('submited') }, 2000);
      return;
    }

    let formData = this.report.screenshots instanceof FormData ? this.report.screenshots : new FormData();
    formData.set("finisher", String(this.report.finisher));
    formData.set("mmr", String(this.report.mmr));
    formData.set("games", String(this.report.games_done));
    formData.set("hours", String(this.report.hours_done));
    formData.set("medal", String(this.report.medal));
    formData.set("comment", String(this.report.comment));
    this._service.sendOrderReport(formData).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        this.responseMessage = 'Отчет добавлен', this.responseSuccess = true;
        setTimeout(() => {
          this.reportSaved.emit(res.body);
          this.close.emit(true);
        }, 2500);
      } else {
        this.responseMessage = 'Отчет не отправлен';
        setTimeout(() => {
          this.form.nativeElement.classList.remove('submited');
        }, 2500);
      }
    }, (error) => {
      this.form.nativeElement.classList.add('submited');
      this.responseMessage = 'Сервис временно недоступен';            
      setTimeout(() => {
        this.form.nativeElement.classList.remove('submited');
      }, 2500);
    });
  }

  onimgloaded(event) : void {
    let files = [].slice.call(event.target.files); 
    if(!files.filter(f => ['image/jpeg','image/jpg','image/gif','image/png'].includes(f.type))) {
      return event.target.value = null;
    }
    event.target.parentNode.nextSibling.value = files.map(f => f.name).join(' ');
    var formData = new FormData();
    files.forEach(f => { formData.append("files[]", f, f.name) });
    this.report.screenshots = formData;
  }
}
