import { Routes } from '@angular/router'; import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.page').then(m => m.LandingPage) },
  { path: 'login', loadComponent: () => import('./features/autenticacao/login.page').then(m => m.LoginPage) },
  { path: 'cadastro', loadComponent: () => import('./features/autenticacao/login.page').then(m => m.LoginPage) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'registro', canActivate: [authGuard], loadComponent: () => import('./features/financas/registro.page').then(m => m.RegistroPage) },
  { path: 'contas', canActivate: [authGuard], loadComponent: () => import('./features/financas/contas.page').then(m => m.ContasPage) },
  { path: '**', redirectTo: '' }
];
