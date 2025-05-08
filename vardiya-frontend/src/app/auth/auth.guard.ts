import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('🔐 AuthGuard → token:', token);
  if (!token) {
    alert('⛔ Token bulunamadı!');
  }

  return token
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
