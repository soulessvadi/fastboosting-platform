import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ComponentService } from "@app/components/components.service";

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: [
    './verify.component.css'
  ]
})
export class VerifyComponent implements OnInit {

  public user: any = null;
  public success: any = null; 
  public message: any = null; 
  public loading = true;

  constructor(private router: Router, private route: ActivatedRoute, public service: ComponentService) { }

  ngOnInit() {
    let hash = this.route.snapshot.paramMap.get('hash');
    this.service.logout();
    this.service.verifyUser(hash).subscribe((res: any) => {
      setTimeout(() => {
        if(res.status == 200 && res.body.user) {
          this.user = res.body.user;
          this.loading = false;
          this.success = true;
          this.message = 'Подтвержден';
        } else {
          this.loading = false;
          this.success = false;
          this.message = 'Активация отклонена';
        }
      }, 3000);
    }, error => {

    });
  }
}
