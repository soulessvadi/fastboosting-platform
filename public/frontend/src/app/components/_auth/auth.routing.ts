
import { ModuleWithProviders } from "@angular/core"
import { Routes, RouterModule } from "@angular/router";


export const routes:Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterModule'
  },
  {
    path: 'register/:hash',
    loadChildren: './register/register.module#RegisterModule'
  },
  {
    path: 'verify/:hash',
    loadChildren: './verify/verify.module#VerifyModule'
  },
  {
    path: 'recovery/:hash',
    loadChildren: './recovery/recovery.module#RecoveryModule'
  },
  {
    path: 'forgot',
    loadChildren: './forgot/forgot.module#ForgotModule'
  },
  {
    path: 'locked/:id',
    loadChildren: './locked/locked.module#LockedModule'
  }
];

export const routing = RouterModule.forChild(routes);
