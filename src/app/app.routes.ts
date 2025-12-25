import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export const appRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },

  { path: 'users', loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent), canActivate: [AuthGuard, RoleGuard], data: { roles: ['SISTEM_YONETICISI'] } },
  { path: 'users/new', loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent), canActivate: [AuthGuard, RoleGuard], data: { roles: ['SISTEM_YONETICISI'] } },

  {
    path: 'vardiya-list', loadComponent: () => import('./vardiya/vardiya-list/vardiya-list.component').then(m => m.VardiyaListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SISTEM_YONETICISI', 'ISLETME_SORUMLUSU', 'NORMAL_KULLANICI'] }
  },

  {
    path: 'vardiya-new', loadComponent: () => import('./vardiya/vardiya-form/vardiya-form.component').then(m => m.VardiyaFormComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SISTEM_YONETICISI', 'ISLETME_SORUMLUSU'] }
  },

  {
    path: 'vardiya-form/:id',
    loadComponent: () => import('./vardiya/vardiya-form/vardiya-form.component').then(m => m.VardiyaFormComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SISTEM_YONETICISI', 'ISLETME_SORUMLUSU'] }
  }
  ,
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SISTEM_YONETICISI'] }
  },  

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
