import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import {MatCard, MatCardContent} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";  // Assuming you have an AuthService to handle API calls
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    NgIf
  ],
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';  // Token from the URL
  newPassword: string = '';  // User's new password
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    // Get the token from the URL query parameter
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  // Method to reset the password
  resetPassword() {
    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.successMessage = 'Password has been reset successfully.';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to reset password. Please try again later.';
        this.successMessage = '';
      }
    });
  }

}
