import { Injectable, ApplicationRef } from '@angular/core';
import { languages } from './languages.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { ComponentService } from '@app/components/components.service';



@Injectable()
export class I18nService {

  public state;
  public data:{};
  public currentLanguage:any;


  constructor(private ref: ApplicationRef, private _service: ComponentService) {
    this.state = new Subject();
    this.initLanguage(localStorage.getItem('locale') || languages[0].key);
    this.fetch(this.currentLanguage.key);
  }

  private fetch(locale: any) {
    this._service.translations(locale).subscribe(data => {
        this.data = data.body;
        this.state.next(this.data);
        this.ref.tick()
    });
  }

  private initLanguage(locale:string) {
    let language = languages.find((it)=> {
      return it.key == locale
    });
    if (language) {
      this.currentLanguage = language;
    } else {
      this.currentLanguage = languages[0];
    }
  }

  setLanguage(language){
    this.currentLanguage = language;
    this.fetch(language.key)
  }


  subscribe(sub:any, err:any) {
    return this.state.subscribe(sub, err)
  }

  public getTranslation(phrase:string):string {
    return this.data && this.data[phrase] ? this.data[phrase] : phrase
  }

}
