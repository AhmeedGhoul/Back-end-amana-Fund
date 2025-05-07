import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../auth.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { AuthRequest } from "../auth.model";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { RecaptchaModule } from "ng-recaptcha";
import { NgIf } from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
@Component({
  selector: 'app-login-normal',
  templateUrl: './login-normal.component.html',
  standalone: true,
  styleUrls: ['./login-normal.component.css'],
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    RecaptchaModule,
    NgIf,
    MatCheckboxModule,
    FormsModule,
  ],
  providers: [
  ]
})
export class LoginNormalComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage = '';
  captchaResponse: string = '';

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

  onCaptchaResolved(captcha: string | null): void {
    this.captchaResponse = captcha || '';
  }


}
