import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'bonuses',
  templateUrl: './bonuses.component.html',
})

export class BonusesComponent implements OnInit {
  public activeTab = 0;
  public Math = Math;
  public responseMessage = null;
  public responseSuccess = false;
  public loading = false;
  public bonuses = null;

  constructor(
    public _service: ComponentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetch();
  }

  public fetch() {
    this._service.getAllBonusesAndPenalties().subscribe(res => {
      this.bonuses = res.body.bonuses;
    })
  }

  public catReorder() {
    this.bonuses = this.bonuses.sort((a,b) => a.id > b.id ? 1 : -1);
  }

  public catAdd() {
    this.bonuses.unshift({id:1,type:1,name:null,description:null,amount:null});
  }

  public catRemove(item) {
    this.bonuses = this.bonuses.filter((a) => a != item);
  }

  public catSave() {
    this.loading = true; 
    this._service.saveBonusesAndPenalties(this.bonuses).subscribe((res: any) => {
      if(res.status == 200) this.responseMessage = 'Сохранено';
      setTimeout(() => { this.loading = false; this.responseMessage = null; }, 1000);
    });
  }
}
