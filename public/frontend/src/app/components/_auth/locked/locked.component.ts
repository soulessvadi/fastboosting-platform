import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ComponentService } from "@app/components/components.service";

@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: [
    './locked.component.css'
  ]
})
export class LockedComponent implements OnInit {

  public user: any = null;

  constructor(private router: Router, private route: ActivatedRoute, public service: ComponentService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getLockedUser(id).subscribe((res: any) => {
      if(res.status == 200 && res.body.user) this.user = res.body.user;
      else this.router.navigate(['/auth/login']);
    }, error => this.router.navigate(['/auth/login']));
  }
}
