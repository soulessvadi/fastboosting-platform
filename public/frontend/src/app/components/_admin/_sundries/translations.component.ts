import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'translations',
  templateUrl: './translations.component.html',
})
export class TranslationsComponent implements OnInit {

  public translations: any = null;

  constructor(private _service: ComponentService) {
  	this._service.getTranslations().subscribe(res => {
  		this.translations = res.body;
  	})
  }

  ngOnInit() {

  }

  public add() {
  	let mock: any = {id: 0, name: '', us: '', ru: '', c: 1};
  	this.translations.unshift(mock);
  }

  public delete(t) {
  	this.translations = this.translations.filter(e => e != t);
  }

  public save(event) {
  	event.target.classList.add('loading');
  	let data = this.translations.filter(e => e.c || e.d || e.u);
  	this._service.setTranslations(data).subscribe(res => {
  		this.translations = res.body;
  		setTimeout(() => { 
  			event.target.classList.remove('loading');
  		}, 1000);
  	})

  }

}
