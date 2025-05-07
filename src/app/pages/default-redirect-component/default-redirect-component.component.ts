import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/side-login/login-choice/auth.service';

@Component({
  selector: 'app-default-redirect',
  standalone: true,
  template: '',
})
export class DefaultRedirectComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    const isLoggedIn = this.authService.isLoggedIn();
    this.router.navigate([isLoggedIn ? '/dashboard' : '/authentication/login']);
  }
}
