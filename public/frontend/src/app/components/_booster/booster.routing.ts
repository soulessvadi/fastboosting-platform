import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "profile",
    pathMatch: "full"
  },{
    path: "profile",
    loadChildren: "./_profile/profile.module#ProfileModule",
    data: { pageTitle: "Профиль" }
  },{
    path: "orders",
    loadChildren: "./_orders/work.module#WorkModule",
    data: { pageTitle: "Заказы" }
  },{
    path: "conditions",
    loadChildren: "./_conditions/conditions.module#ConditionsModule",
    data: { pageTitle: "Условия работы" }
  },{
    path: "support",
    loadChildren: "./_support/support.module#BoosterSupportModule",
    data: { pageTitle: "Поддержка бустеров" }
  },{
    path: "balance",
    loadChildren: "./_balance/balance.module#BalanceModule",
    data: { pageTitle: "Баланс пользователя" }
  },
];

export const Router = RouterModule.forChild(routes);
