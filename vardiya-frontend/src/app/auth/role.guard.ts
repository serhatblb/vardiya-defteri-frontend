// src/app/auth/role.guard.ts
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { inject } from '@angular/core';
import { RoleService, UserRole } from '../services/role.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const allowed = route.data['roles'] as UserRole[];
  const roleSvc = inject(RoleService);
  const userRole = roleSvc.getUserRole();
  const router = inject(Router);

  console.log('🛡️ RoleGuard → userRole:', userRole, 'allowed:', allowed);
  console.log('🛡️ returnUrl:', state.url);

  if (!userRole) {
    alert('❌ RoleGuard: userRole null!');
    return router.createUrlTree(['/login']);
  }

  if (!allowed.includes(userRole)) {
    alert('❌ RoleGuard: role izin vermiyor!');
    return router.createUrlTree(['/login']);
  }

  return true;
};
