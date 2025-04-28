import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth.service';
import {MatCard, MatCardContent} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";  // Adjust path if needed
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forget-password.component.html',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    MatButton,
    MatInput
  ],
  styleUrls: ['./forget-password.component.css']
})
export class ForgotPasswordComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;

    const email = this.form.value.email;
    if (!email) {
      console.error('email not found');
      return;
    }
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.successMessage = 'Password reset link sent to your email.';
      },
      error: (error) => {
        this.errorMessage = 'Failed to send reset link.';
      }
    });
  }
}
