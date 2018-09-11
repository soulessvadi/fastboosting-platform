import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "orders",
    pathMatch: "full"
  },{
    path: "support",
    loadChildren: "./_support/supports.module#SupportsModule",
    data: { pageTitle: "Поддержка" }
  },{
    path: "sundry",
    loadChildren: "./_sundries/sundries.module#SundriesModule",
    data: { pageTitle: "Разное" }
  },{
    path: "orders",
    loadChildren: "./_orders/orders.module#OrdersModule",
    data: { pageTitle: "Заказы" }
  },{
    path: "users",
    loadChildren: "./_users/clients/clients.module#ClientsModule",
    data: { pageTitle: "Клиенты" }
  },{
    path: "boosters",
    loadChildren: "./_users/boosters/boosters.module#BoostersModule",
    data: { pageTitle: "Бустеры" }
  },{
    path: "partners",
    loadChildren: "./_users/partners/partners.module#PartnersModule",
    data: { pageTitle: "Партнеры" }
  },{
    path: "finance",
    loadChildren: "./_finance/finance.module#FinanceModule",
    data: { pageTitle: "Партнеры" }
  },{
    path: "settings",
    loadChildren: "./_settings/settings.module#SettingsModule",
    data: { pageTitle: "Настройки системы" }
  },
];

export const Router = RouterModule.forChild(routes);
