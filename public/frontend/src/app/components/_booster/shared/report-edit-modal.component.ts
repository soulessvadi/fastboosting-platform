import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'report-edit-modal',
  templateUrl: './report-edit-modal.component.html',
})

export class ReportEditModalComponent implements OnInit {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()
  @Output() changed = new EventEmitter()
  @Output() reportSaved = new EventEmitter()
  @Input() report: any = {};
  @Input() medals: any = [];
  @ViewChild('form') form;
  @ViewChild('message') message;
  @ViewChild('screenshots') screenshots;
  public responseMessage = null;
  public responseSuccess = false;
  public chosen_medal: any = {};

  constructor(public _service: ComponentService) {

  }

  ngOnInit() {
    this.report.files = typeof this.report.files == 'object' ? this.report.files : (this.report.files ? String(this.report.files).split('|') : []);
    this.report.medal = this.report.medal <= 0 ? 1 : this.report.medal;
    this.report.games_done = !this.report.games_done ? 0 : this.report.games_done;
    this.report.mmr = !this.report.mmr ? 0 : this.report.mmr;
    this.report.hours_done = !this.report.hours_done ? 0 : this.report.hours_done;
  }

  send() {
    let formData = this.report.screenshots instanceof FormData ? this.report.screenshots : new FormData();
    formData.set("finisher", String(this.report.finisher));
    formData.set("mmr", String(this.report.mmr));
    formData.set("games", String(this.report.games_done));
    formData.set("hours", String(this.report.hours_done));
    formData.set("medal", String(this.report.medal));
    formData.set("comment", String(this.report.comment));
    this._service.saveOrderReport(this.report.id, formData).subscribe(res => {
      this.form.nativeElement.classList.add('submited');
      if(res.status == 200) { 
        if(res.body.files.length) this.report.files = res.body.files.concat(this.report.files).filter(e => e);
        this.responseMessage = 'Отчет сохранен', this.responseSuccess = true;
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

  removeScrsht(filename) {
    this._service.removeScreenshot(filename).subscribe(res => {
      if(res.status == 200) { 
        this.report.files = this.report.files.filter(e => e != filename);
      }
    }, (error) => null);
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
