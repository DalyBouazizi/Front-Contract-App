import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // If the user is authenticated, allow the navigation
    return true;
  } else {
    // If the user is not authenticated, redirect to the login page
    router.navigate(['/login']);
    return false;
  }
};
