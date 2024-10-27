import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.checkLogin(); // Implement your authentication logic here
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/auth/login']); // Redirect to login page
      return false;
    }
  }

  checkLogin(): boolean {
    // Example: Check if user is authenticated
    return !!localStorage.getItem('authToken');
  }
}
