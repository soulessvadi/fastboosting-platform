import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'sa-bonuses',
  templateUrl: './bonuses.component.html',
})

export class BonusesComponent implements OnInit {

  constructor(private _service: ComponentService) {}

  public types = [];

  ngOnInit() {
    this._service.getBonusesAndPenalties().subscribe(res => {
      this.types = res.body.types;
    })
  }

}
