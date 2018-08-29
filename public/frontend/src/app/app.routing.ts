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
    data: { pageTitle: "Правительство" },
    children: [{
      path: "",
      redirectTo: "support",
      pathMatch: "full"
    },{
      path: "support",
      loadChildren: "./components/_admin/_support/support.module#SupportModule",
      data: { pageTitle: "Поддержка" }
    },{
      path: "sundry",
      loadChildren: "./components/_admin/_sundries/sundries.module#SundriesModule",
      data: { pageTitle: "Разное" }
    },{
      path: "orders",
      loadChildren: "./components/_admin/_orders/orders.module#OrdersModule",
      data: { pageTitle: "Разное" }
    }]
  },{
    path: "",
    component: MainLayoutComponent,
    canActivate: [ AuthGuard ],
    data: { pageTitle: "Платформа" },
    children: [{
      path: "",
      redirectTo: "profile",
      pathMatch: "full"
    },{
      path: "profile",
      loadChildren: "./components/_profile/profile.module#ProfileModule",
      data: { pageTitle: "Профиль" }
    },{
      path: "orders",
      loadChildren: "./components/_orders/orders.module#OrdersModule",
      data: { pageTitle: "Заказы" }
    },{
      path: "conditions",
      loadChildren: "./components/_conditions/conditions.module#ConditionsModule",
      data: { pageTitle: "Условия работы" }
    },{
      path: "support",
      loadChildren: "./components/_support/support.module#SupportModule",
      data: { pageTitle: "Поддержка бустеров" }
    },{
      path: "balance",
      loadChildren: "./components/_balance/balance.module#BalanceModule",
      data: { pageTitle: "Баланс пользователя" }
    },

    {
      path: "dashboard",
      loadChildren: "./features/dashboard/dashboard.module#DashboardModule",
      data: { pageTitle: "Dashboard" }
    },{
      path: "app-views",
      loadChildren: "./features/app-views/app-views.module#AppViewsModule",
      data: { pageTitle: "App Views" }
    },{
      path: "calendar",
      loadChildren: "app/features/calendar/calendar.module#CalendarFeatureModule",
      data: { pageTitle: "Calendar" }
    },{
      path: "e-commerce",
      loadChildren: "./features/e-commerce/e-commerce.module#ECommerceModule",
      data: { pageTitle: "E-commerce" }
    },{
      path: "forms",
      loadChildren: "./features/forms/forms-showcase.module#FormsShowcaseModule",
      data: { pageTitle: "Forms" }
    },{
      path: "graphs",
      loadChildren: "./features/graphs/graphs-showcase.module#GraphsShowcaseModule",
      data: { pageTitle: "Graphs" }
    },{
      path: "maps",
      loadChildren: "./features/maps/maps.module#MapsModule",
      data: { pageTitle: "Maps" }
    },{
      path: "miscellaneous",
      loadChildren: "./features/miscellaneous/miscellaneous.module#MiscellaneousModule",
      data: { pageTitle: "Miscellaneous" }
    },{
      path: "outlook",
      loadChildren: "./features/outlook/outlook.module#OutlookModule",
      data: { pageTitle: "Outlook" }
    },{
      path: "smartadmin",
      loadChildren: "./features/smartadmin-intel/smartadmin-intel.module#SmartadminIntelModule",
      data: { pageTitle: "Smartadmin" }
    },{
      path: "tables",
      loadChildren: "./features/tables/tables.module#TablesModule",
      data: { pageTitle: "Tables" }
    },{
      path: "ui",
      loadChildren: "./features/ui-elements/ui-elements.module#UiElementsModule",
      data: { pageTitle: "Ui" }
    },{
      path: "widgets",
      loadChildren: "./features/widgets/widgets-showcase.module#WidgetsShowcaseModule",
      data: { pageTitle: "Widgets" }
    }]
  },{ 
    path: "**", 
    redirectTo: "/govt/sundry/404" 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})

export class AppRoutingModule {}
