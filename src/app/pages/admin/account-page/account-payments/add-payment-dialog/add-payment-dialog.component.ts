import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AccountPaymentService } from '@app/services/account-payment.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AccountPayment } from '@app/models/account-payment.model';

@Component({
  selector: 'app-add-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './add-payment-dialog.component.html',
  styleUrls: ['./add-payment-dialog.component.scss']
})
export class AddPaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountPaymentService: AccountPaymentService,
    private dialogRef: MatDialogRef<AddPaymentDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      paymentDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      agencyName: ['', Validators.required],
      rib: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const formData: AccountPayment = this.paymentForm.value;
      this.accountPaymentService.createAccountPayment(formData).subscribe({
        next: (response: AccountPayment) => {
          this.snackBar.open('Payment added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(response);
        },
        error: (error: any) => {
          console.error('Error creating payment:', error);
          this.snackBar.open('Error adding payment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 