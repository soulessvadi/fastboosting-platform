import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainLayoutComponent } from "./components/elements/layouts/main-layout.component";
import { AuthLayoutComponent } from "./components/elements/layouts/auth-layout.component";
import { AdminLayoutComponent } from "./components/elements/layouts/admin-layout.component";
import { AuthGuard } from './guards'

const routes: Routes = [
  {
    path: "auth",
    component: AuthLayoutComponent,
    loadChildren: "./components/_auth/auth.module#AuthModule"
  },{
    path: "govt",
    component: AdminLayoutComponent,
    canActivate: [ AuthGuard ],
    data: { pageTitle: "Администрация" },
    loadChildren: "./components/_admin/admin.module#AdminModule"
  },{
    path: "",
    component: MainLayoutComponent,
    canActivate: [ AuthGuard ],
    data: { pageTitle: "Платформа" },
    children: [
    {
      path: "",
      redirectTo: "profile",
      pathMatch: "full"
    },{
      path: "profile",
      loadChildren: "./components/_booster/_profile/profile.module#ProfileModule",
      data: { pageTitle: "Профиль" }
    },{
      path: "orders",
      loadChildren: "./components/_booster/_orders/work.module#WorkModule",
      data: { pageTitle: "Заказы" }
    },{
      path: "conditions",
      loadChildren: "./components/_booster/_conditions/conditions.module#ConditionsModule",
      data: { pageTitle: "Условия работы" }
    },{
      path: "support",
      loadChildren: "./components/_booster/_support/support.module#BoosterSupportModule",
      data: { pageTitle: "Поддержка бустеров" }
    },{
      path: "balance",
      loadChildren: "./components/_booster/_balance/balance.module#BalanceModule",
      data: { pageTitle: "Баланс пользователя" }
    }]
  },{ 
    path: "**", 
    redirectTo: "/404" 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})

export class AppRoutingModule {}
