import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ComponentService {

	constructor(private http: HttpClient) {}

	public endpoint: string = 'http://localhost:4000/api/v1';

  public register(user: any): Observable<any> {
    let options = this.getOptions({});
    return this.http.post(`${this.endpoint}/users`, user, {observe: 'response'});
  }

  public getSlides(page: number): Observable<any> {
    let options = this.getOptions({p:page});
    return this.http.get(`${this.endpoint}/getSlides`, options);
  }

  public getOptions(params: any): any {
    let options = { search: new URLSearchParams() };
    for (let key in params) options.search.set(key, params[key] || '');
    return options;
  }

}
