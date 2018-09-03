import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ComponentService {

  public endpoint: string = 'http://localhost:4000/api/v1';
  public cdn_endpoint: string = 'http://localhost:4000/cdn/';
  public store_heroes: string = this.cdn_endpoint + 'heroes/';
  public store_medals: string = this.cdn_endpoint + 'ranks/';
  public store_avatars: string = this.cdn_endpoint + 'avatars/';
  public store_shared: string = this.cdn_endpoint + 'shared/';
  public store_screenshots: string = this.cdn_endpoint + 'reports/';
  public user: any = {};
  public medals: any = null;
  public heroes: any = null;
  public lanes: any = null;
  public servers: any = null;
  public countries: any = null;
  public paymethods: any = null;
  public accessible_orders: any = null;
  public history_orders: any = null;
  public active_order: any = null;
  public orders_types: any = null;
  public ranks: any = null;
  public services: any = null;

  set _user(user: any) {
    this.user = user;
    this.storage.tot('user', this.user);
  }

  get _user() {
    this.user = this.storage.fetch('user');
    return this.user;
  }

  set _token(token: string) {
    this.storage.tot('token', token);
  }

  get _token() {
    return this.storage.fetch('token');
  }

  get _auth() {
    return new HttpHeaders({ 'Authorization': this._token });
  }

  get _reviews() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/users/me/logs&reviews`, { observe: 'response', headers: this._auth }).subscribe((res) => {
        if(res.status == 200) {
          resolve(res.body);
        }
      });
    })
  }

  get _heroes() {
    return new Promise((resolve, reject) => {
      if(!this.heroes || !this.heroes.length) {
        this.http.get(`${this.endpoint}/interface/heroes/`, { observe: 'response', headers: this._auth }).subscribe((res) => {
          if(res.status == 200) {
            this.heroes = res.body;
            resolve(this.heroes);
          }
        });
      } else {
        resolve(this.heroes);
      }
    })
  }

  get _medals() {
    return new Promise((resolve, reject) => {
      if(!this.medals || !this.medals.length) {
        this.http.get(`${this.endpoint}/interface/medals/`, { observe: 'response', headers: this._auth }).subscribe((res) => {
          if(res.status == 200) {
            this.medals = res.body;
            resolve(this.medals);
          }
        });
      } else {
        resolve(this.medals);
      }
    })
  }

  get _lanes() {
    return new Promise((resolve, reject) => {
      if(!this.lanes || !this.lanes.length) {
        this.http.get(`${this.endpoint}/interface/lanes/`, { observe: 'response', headers: this._auth }).subscribe((res) => {
          if(res.status == 200) {
            this.lanes = res.body;
            resolve(this.lanes);
          }
        });
      } else {
        resolve(this.lanes);
      }
    })
  }

  get _servers() {
    return new Promise((resolve, reject) => {
      if(!this.servers || !this.servers.length) {
        this.http.get(`${this.endpoint}/interface/servers/`, { observe: 'response', headers: this._auth }).subscribe((res) => {
          if(res.status == 200) {
            this.servers = res.body;
            resolve(this.servers);
          }
        });
      } else {
        resolve(this.servers);
      }
    })
  }

  get _countries() {
    return new Promise((resolve, reject) => {
      if(!this.countries || !this.countries.length) {
        this.http.get(`${this.endpoint}/interface/countries/`, { observe: 'response', headers: this._auth }).subscribe((res) => {
          if(res.status == 200) {
            this.countries = res.body;
            resolve(this.countries);
          }
        });
      } else {
        resolve(this.countries);
      }
    })
  }

  get _paymethods() {
    return new Promise((resolve, reject) => {
      if(!this.paymethods || !this.paymethods.length) {
        this.http.get(`${this.endpoint}/interface/paymethods/`, { observe: 'response', headers: this._auth }).subscribe((res) => {
          if(res.status == 200) {
            this.paymethods = res.body;
            resolve(this.paymethods);
          }
        });
      } else {
        resolve(this.paymethods);
      }
    })
  }

  get _accessible_orders() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/orders/pending`, { observe: 'response', headers: this._auth }).subscribe((res: any) => {
        if(res.status == 200) {
          this.accessible_orders = res.body.orders;
          this.lanes = res.body.lanes;
          this.orders_types = res.body.types;
          this.servers = res.body.servers;
          this.ranks = res.body.ranks;
          this.services = res.body.services;
          resolve(this.accessible_orders);
        }
      });
    })
  }

  get _history_orders() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/orders/history`, { observe: 'response', headers: this._auth }).subscribe((res: any) => {
        if(res.status == 200) {
          this.history_orders = res.body.orders;
          this.lanes = res.body.lanes;
          this.orders_types = res.body.types;
          this.servers = res.body.servers;
          this.ranks = res.body.ranks;
          this.services = res.body.services;
          resolve(this.history_orders);
        }
      });
    })
  }

  get _active_order() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/orders/active`, { observe: 'response', headers: this._auth }).subscribe((res: any) => {
        if(res.status == 200) {
          this.active_order = res.body.order;
          this.lanes = res.body.lanes;
          this.orders_types = res.body.types;
          this.servers = res.body.servers;
          this.ranks = res.body.ranks;
          this.services = res.body.services;
          resolve(this.active_order);
        } else {
          resolve(res.body);
        }
      });
    })
  }

  get _tickets_statuses() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/tickets/statuses`, { observe: 'response', headers: this._auth }).subscribe((res: any) => {
        resolve(res.body);
      });
    })
  }

  get _tickets_types() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/tickets/types`, { observe: 'response', headers: this._auth }).subscribe((res: any) => {
        resolve(res.body);
      });
    })
  }

  get user_types() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.endpoint}/interface/userTypes`, { observe: 'response', headers: this._auth }).subscribe((res: any) => {
        resolve(res.body);
      });
    })
  }

  constructor(private http: HttpClient) {

  }

  public smallBox(data, cb?) {
    $.smallBox(data, cb)
  }

  public bigBox(data, cb?) {
    $.bigBox(data, cb)
  }

  public smartMessageBox(data, cb?) {
    $.SmartMessageBox(data, cb)
  }

  isEmail(mixed) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(mixed);
  }

  public getDatesRange(start, end) {
    function addDays(date, days) {
      let entity = new Date(date);
      entity.setDate(entity.getDate() + days);
      return entity;
    }
    let array = [];
    start = new Date(start);
    end = new Date(end);
    while (start <= end) {
        array.push(new Date(start));
        start = addDays(start, 1);
    }
    return array;
  }

  public getMonthName(date, type?) {
    type = type && type == 'long' ? 'long' : 'short';
    let month = new Date(date).getMonth();
    let months = {
      'long':['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
      'short':['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    };
    return months[type][month];
  }

  public storage = {
    tot: function(key:string, data:any) {
      if(key.length < 1) throw 'Storage Service: check out the key';
      if(typeof data == 'object') {
        data = JSON.stringify(data);
      }
      localStorage.setItem(key, data);
      return true;
    },
    fetch: function(key: string) {
      if(key.length < 1) throw 'Storage Service: check out the key';
      try {
        var json = JSON.parse(localStorage.getItem(key));
        return json;
      } catch(e) {
        return localStorage.getItem(key);
      }
    },
    remove: function(key: string): void {
      localStorage.removeItem(key);
    },
    flush: function(): void {
      localStorage.clear();
    }
  };

  public storeToken(token: string) {
    this.storage.tot('token', token);
  }

  public fetchToken(token: string) {
    return this.storage.fetch('token');
  }

  public register(user: any): Observable<any> {
    return this.http.post(`${this.endpoint}/register`, user, { observe: 'response' });
  }

  public login(user: any): Observable<any> {
    return this.http.post(`${this.endpoint}/authorize`, user, { observe: 'response' });
  }

  public recovery(user: any): Observable<any> {
    return this.http.post(`${this.endpoint}/recovery`, user, { observe: 'response' });
  }

  public logout(): void {
    this.storage.flush();
  }

  public translations(locale) {
    return this.http.get(`${this.endpoint}/interface/translate`, { params: {locale: locale}, observe: 'response' })
  }

  public menu() {
    return this.http.get(`${this.endpoint}/interface/menu`, { observe: 'response', headers: this._auth  })
  }

  public getProfile(): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me`, { observe: 'response', headers: this._auth });
  }

  public updateProfile(user: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/users/me`, user, { observe: 'response', headers: this._auth });
  }

  public changePassword(data: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/users/me/changePassword`, data, { observe: 'response', headers: this._auth });
  }

  public getSelfTxs(data: any): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/txs`, { params: data,  observe: 'response', headers: this._auth });
  }

  public getSelfPayoutData(data: any): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/payoutRequests`, { params: data,  observe: 'response', headers: this._auth });
  }

  public sendNewPayoutRequest(data: any): Observable<any>  {
    return this.http.post(`${this.endpoint}/users/me/payoutRequests`, data, { observe: 'response', headers: this._auth });
  }

  public getSelfBalanceStatistics(data: any): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/balanceStatistics`, { params: data,  observe: 'response', headers: this._auth });
  }

  public getSelfBoosterStatistics(data: any): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/boosterStatistics`, { params: data,  observe: 'response', headers: this._auth });
  }

  public getSelfEvents(): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/events`, { observe: 'response', headers: this._auth });
  }

  public getSelfPricelists(): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/pricelists`, { observe: 'response', headers: this._auth });
  }

  public postComment(data: any): Observable<any>  {
    return this.http.post(`${this.endpoint}/news/comment`, data, { observe: 'response', headers: this._auth });
  }

  public sendOrderIssue(issue: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/orders/active/issue`, issue, { observe: 'response', headers: this._auth });
  }

  public sendOrderReport(formData: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/orders/active/report`, formData, { observe: 'response', headers: this._auth });
  }

  public saveOrderReport(report_id, formData: object): Observable<any>  {
    return this.http.put(`${this.endpoint}/orders/reports/${report_id}`, formData, { observe: 'response', headers: this._auth });
  }

  public removeScreenshot(filename): Observable<any>  {
    return this.http.delete(`${this.endpoint}/orders/reports/screenshot/${filename}`, { observe: 'response', headers: this._auth });
  }

  public setWorkerStatus(status: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/orders/active/workerStatus`, status, { observe: 'response', headers: this._auth });
  }

  public setOrderDotabuff(dotabuff: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/orders/active/setDotabuff`, dotabuff, { observe: 'response', headers: this._auth });
  }

  public cancelOrder(data?: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/orders/active/cancelOrder`, data, { observe: 'response', headers: this._auth });
  }

  public joinOrder(data: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/orders/joinOrder`, data, { observe: 'response', headers: this._auth });
  }

  public getSelfTickets(data: any): Observable<any>  {
    return this.http.get(`${this.endpoint}/tickets/self`, { params: data,  observe: 'response', headers: this._auth });
  }

  public getContacts(): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/contacts`, { observe: 'response', headers: this._auth });
  }

  public getBonusesAndPenalties(): Observable<any>  {
    return this.http.get(`${this.endpoint}/users/me/bonuses&penalties`, { observe: 'response', headers: this._auth });
  }

  public getTranslations(): Observable<any>  {
    return this.http.get(`${this.endpoint}/interface/translations`, { observe: 'response', headers: this._auth });
  }

  public setTranslations(data: any): Observable<any>  {
    return this.http.post(`${this.endpoint}/interface/translations`, data, { observe: 'response', headers: this._auth });
  }

  public sendNewTicket(issue: object): Observable<any>  {
    return this.http.post(`${this.endpoint}/tickets/new`, issue, { observe: 'response', headers: this._auth });
  }

  public getAllOrders(params): Observable<any> {
    return this.http.get(`${this.endpoint}/orders/all`, { params: params, observe: 'response', headers: this._auth });
  }

  public getProblematicOrders(params): Observable<any> {
    return this.http.get(`${this.endpoint}/orders/problematic`, { params: params, observe: 'response', headers: this._auth });
  }

  public getOrderByNumber(system_number): Observable<any> {
    return this.http.get(`${this.endpoint}/orders/${system_number}`, { observe: 'response', headers: this._auth });
  }

  public saveOrder(system_number, data): Observable<any> {
    return this.http.post(`${this.endpoint}/orders/${system_number}`, data, { observe: 'response', headers: this._auth });
  }

  public getAllTickets(data: any): Observable<any> {
    return this.http.get(`${this.endpoint}/tickets/all`, { params: data,  observe: 'response', headers: this._auth });
  }

  public getTicketByNumber(system_number): Observable<any> {
    return this.http.get(`${this.endpoint}/tickets/${system_number}`, { observe: 'response', headers: this._auth });
  }

  public saveTicket(system_number, data): Observable<any> {
    return this.http.post(`${this.endpoint}/tickets/${system_number}`, data, { observe: 'response', headers: this._auth });
  }

  public getPartners(params): Observable<any> {
    return this.http.get(`${this.endpoint}/partners/`, { params: params, observe: 'response', headers: this._auth });
  }

  public getPartner(user_id): Observable<any> {
    return this.http.get(`${this.endpoint}/partners/${user_id}`, { observe: 'response', headers: this._auth });
  }

  public savePartnerBoostPricelist(user_id, data): Observable<any> {
    return this.http.post(`${this.endpoint}/partners/${user_id}/pricelists/boost`, data, { observe: 'response', headers: this._auth });
  }

  public createPartner(user_id, data): Observable<any> {
    return this.http.post(`${this.endpoint}/partners`, data, { observe: 'response', headers: this._auth });
  }

  public savePartner(partner_id, data): Observable<any> {
    return this.http.put(`${this.endpoint}/partners/${partner_id}`, data, { observe: 'response', headers: this._auth });
  }

  public approvePartner(params): Observable<any> {
    return this.http.put(`${this.endpoint}/partners/approve`, params, { observe: 'response', headers: this._auth });
  }

  public blockPartner(params): Observable<any> {
    return this.http.put(`${this.endpoint}/partners/block`, params, { observe: 'response', headers: this._auth });
  }

  public removePartner(user_id): Observable<any> {
    return this.http.delete(`${this.endpoint}/partners/${user_id}`, { observe: 'response', headers: this._auth });
  }

  public getPartnersStatistics(): Observable<any> {
    return this.http.get(`${this.endpoint}/partners/statistics`, { observe: 'response', headers: this._auth });
  }

  public generateApiKey(): Observable<any> {
    return this.http.get(`${this.endpoint}/partners/keygen`, { observe: 'response', headers: this._auth });
  }

  public getClients(params): Observable<any> {
    return this.http.get(`${this.endpoint}/users/clients`, { params: params, observe: 'response', headers: this._auth });
  }

  public getClient(user_id): Observable<any> {
    return this.http.get(`${this.endpoint}/users/clients/${user_id}`, { observe: 'response', headers: this._auth });
  }

  public saveClient(user_id, data): Observable<any> {
    return this.http.put(`${this.endpoint}/users/clients/${user_id}`, data, { observe: 'response', headers: this._auth });
  }

  public createClient(user_id, data): Observable<any> {
    return this.http.post(`${this.endpoint}/users/clients`, data, { observe: 'response', headers: this._auth });
  }

  public getBoosters(params): Observable<any> {
    return this.http.get(`${this.endpoint}/users/boosters`, { params: params, observe: 'response', headers: this._auth });
  }

  public getBooster(user_id): Observable<any> {
    return this.http.get(`${this.endpoint}/users/boosters/${user_id}`, { observe: 'response', headers: this._auth });
  }

  public saveBooster(user_id, data): Observable<any> {
    return this.http.put(`${this.endpoint}/users/boosters/${user_id}`, data, { observe: 'response', headers: this._auth });
  }

  public createBooster(user_id, data): Observable<any> {
    return this.http.post(`${this.endpoint}/users/boosters`, data, { observe: 'response', headers: this._auth });
  }

  public getUsersTypes(params): Observable<any> {
    return this.http.get(`${this.endpoint}/users/types`, { params: params, observe: 'response', headers: this._auth });
  }

  public getType(type_id): Observable<any> {
    return this.http.get(`${this.endpoint}/users/types/${type_id}`, { observe: 'response', headers: this._auth });
  }

  public saveType(type_id, data): Observable<any> {
    return this.http.put(`${this.endpoint}/users/types/${type_id}`, data, { observe: 'response', headers: this._auth });
  }

  public createType(type_id, data): Observable<any> {
    return this.http.post(`${this.endpoint}/users/types`, data, { observe: 'response', headers: this._auth });
  }

  public removeType(type_id): Observable<any> {
    return this.http.delete(`${this.endpoint}/users/types/${type_id}`, { observe: 'response', headers: this._auth });
  }

  public getAllUsers(params): Observable<any> {
    return this.http.get(`${this.endpoint}/users`, { params: params, observe: 'response', headers: this._auth });
  }

  public getUser(user_id): Observable<any> {
    return this.http.get(`${this.endpoint}/users/${user_id}`, { observe: 'response', headers: this._auth });
  }

  public createUser(user_id, data): Observable<any> {
    return this.http.post(`${this.endpoint}/users`, data, { observe: 'response', headers: this._auth });
  }

  public saveUser(user_id, data): Observable<any> {
    return this.http.put(`${this.endpoint}/users/${user_id}`, data, { observe: 'response', headers: this._auth });
  }

  public removeUser(user_id): Observable<any> {
    return this.http.delete(`${this.endpoint}/users/${user_id}`, { observe: 'response', headers: this._auth });
  }

  public approveUser(params): Observable<any> {
    return this.http.put(`${this.endpoint}/users/approve`, params, { observe: 'response', headers: this._auth });
  }

  public blockUser(params): Observable<any> {
    return this.http.put(`${this.endpoint}/users/block`, params, { observe: 'response', headers: this._auth });
  }

  public getBoostersStatistics(): Observable<any> {
    return this.http.get(`${this.endpoint}/users/boosters/statistics`, { observe: 'response', headers: this._auth });
  }

  public getTxs(params): Observable<any> {
    return this.http.get(`${this.endpoint}/txs/`, { params: params, observe: 'response', headers: this._auth });
  }

  public getPayoutRequests(params): Observable<any> {
    return this.http.get(`${this.endpoint}/users/payoff`, { params: params, observe: 'response', headers: this._auth });
  }

  public getPayoutRequest(id): Observable<any> {
    return this.http.get(`${this.endpoint}/users/payoff/${id}`, { observe: 'response', headers: this._auth });
  }

  public savePayoutRequest(id, params): Observable<any> {
    return this.http.put(`${this.endpoint}/users/payoff/${id}`, params, { observe: 'response', headers: this._auth });
  }

  public removePayoutRequest(id): Observable<any> {
    return this.http.delete(`${this.endpoint}/users/payoff/${id}`, { observe: 'response', headers: this._auth });
  }

  public removeTx(tx_id): Observable<any> {
    return this.http.delete(`${this.endpoint}/txs/${tx_id}`, { observe: 'response', headers: this._auth });
  }

  public saveTx(tx_id, data): Observable<any> {
    return this.http.put(`${this.endpoint}/txs/${tx_id}`, data, { observe: 'response', headers: this._auth });
  }

  public getReports(params): Observable<any> {
    return this.http.get(`${this.endpoint}/orders/reports`, { params: params, observe: 'response', headers: this._auth });
  }

  public removeReport(tx_id): Observable<any> {
    return this.http.delete(`${this.endpoint}/orders/reports/${tx_id}`, { observe: 'response', headers: this._auth });
  }

  public getPricelists(): Observable<any>  {
    return this.http.get(`${this.endpoint}/interface/pricelists`, { observe: 'response', headers: this._auth });
  }

  public saveBoostPricelist(data): Observable<any> {
    return this.http.post(`${this.endpoint}/interface/pricelists/boost`, data, { observe: 'response', headers: this._auth });
  }

  public saveMedalPricelist(data): Observable<any> {
    return this.http.post(`${this.endpoint}/interface/pricelists/medal`, data, { observe: 'response', headers: this._auth });
  }

  public savePricelistCategories(data): Observable<any> {
    return this.http.post(`${this.endpoint}/interface/pricelists/categories`, data, { observe: 'response', headers: this._auth });
  }
}
