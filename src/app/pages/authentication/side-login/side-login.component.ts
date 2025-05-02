import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service'; // Adjust path if needed
import { AuthRequest } from './auth.model';   // Adjust path if needed
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    RecaptchaModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage = '';

  get f() {
    return this.form.controls;
  }
  forgotPassword() {
    this.router.navigate(['/authentication/forgot-password']);
  }

  submit() {
    if (this.form.invalid) return;

    const authData: AuthRequest = {
      email: this.form.value.uname!,
      password: this.form.value.password!
    };

    this.authService.login(authData).subscribe({
      next: () => {
        this.router.navigate(['/authentication/2fa']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
  captchaResponse: string = '';

  onCaptchaResolved(captcha: string | null): void {
    this.captchaResponse = captcha || '';
  }

}
