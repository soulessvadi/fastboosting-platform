import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/core/services/notification.service";
import { ComponentService } from "@app/components/components.service";

@Component({
  selector: "sa-logout",
  template: `
    <div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
        <span> <a title="Sign Out"><i class="fas fa-sign-out-alt"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  public user

  constructor(
    private _service: ComponentService,
    private router: Router,
  ) {
  }

  showPopup() {
    this._service.smartMessageBox({
        title:"<i class='fas fa-sign-out-alt txt-color-orangeDark'></i> Выйти из системы <span class='txt-color-orangeDark'><strong>" + this._service._user.nick_name + "</strong></span> ?",
        content:"Для безопасности, после выхода, закройте вкладку с приложением.",
        buttons: "[Нет][Да]"
      }, (a, b, c) => {
        if (c == 1) this.logout();
      }
    );
  }

  logout() {
    this.router.navigate(["/auth/login"]);
    this._service.logout();
    this._service.smallBox({
      title: "Возвращайтесь",
      content: "&nbsp;",
      color: "#df4a3a",
      icon: "fas fa-sign-out-alt bounce animated",
      iconSmall: false,
      timeout: 5000
    });
  }

  ngOnInit() {}
}
