import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './two-factor-auth.component.html',
})
export class TwoFactorAuthComponent {
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  form = new FormGroup({
    token: new FormControl('', Validators.required),
  });

  submit() {
    const token = this.form.get('token')?.value;
    this.http.get<any>(`/api/v1/auth/F2A?token=${token}`).subscribe({
      next: (res) => {
        localStorage.setItem('authToken', res.token); // Save token
        this.snackBar.open('2FA Verified Successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.snackBar.open('Invalid or expired token.', 'Close', { duration: 3000 });
      },
    });
  }
}
