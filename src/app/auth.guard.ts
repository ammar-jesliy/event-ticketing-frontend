import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  // Get the required role from the route data
  const allowedRoles = route.data['allowedRoles'] || [];
  const userRole = localStorage.getItem('userRole');

  // Check if the user's role is allowed to access the route
  if (!allowedRoles.includes(userRole || '')) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
