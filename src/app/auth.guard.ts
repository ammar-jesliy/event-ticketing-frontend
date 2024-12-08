/**
 * Auth guard function to protect routes based on authentication status and user roles.
 *
 * This function checks if the user is authenticated and if their role is allowed to access the route.
 * If the user is not authenticated, they are redirected to the login page.
 * If the user's role is not allowed, they are redirected to the unauthorized page.
 *
 * @param route - The activated route snapshot that contains the route data.
 * @param state - The router state snapshot.
 * @returns A boolean indicating whether the route can be activated.
 */

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
