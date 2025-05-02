import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../side-login/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const user = this.authService.getCurrentUser();
    const normalizedRoles = user.roles.map(r => r.replace('ROLE_', ''));

    console.log('[RoleGuard] Expected:', expectedRole);
    console.log('[RoleGuard] User roles:', normalizedRoles);

    if (normalizedRoles.includes(expectedRole)) {
      return true;
    }

    this.router.navigate(['/not-found']);
    return false;
  }
}
