import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountService } from '@app/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountPayment } from '@app/models/account-payment.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  selector: 'app-account-payment-dialog',
  template: `
    <h2 mat-dialog-title>Create Account Payment</h2>
    <div mat-dialog-content>
      <form [formGroup]="paymentForm">
        <mat-form-field>
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount">
          <mat-error *ngIf="paymentForm.get('amount')?.invalid">
            Please enter a valid amount
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Agency Name</mat-label>
          <input matInput type="text" formControlName="agencyName">
          <mat-error *ngIf="paymentForm.get('agencyName')?.invalid">
            Please enter an agency name
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Payment Date</mat-label>
          <input matInput type="date" formControlName="paymentDate">
          <mat-error *ngIf="paymentForm.get('paymentDate')?.invalid">
            Please enter a valid payment date
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()" [disabled]="paymentForm.invalid">Create Payment</button>
    </div>
  `,

  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class AccountPaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountPaymentDialogComponent>,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { rib: string }
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      agencyName: ['', Validators.required],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const payment: AccountPayment = {
        paymentDate: `${this.paymentForm.get('paymentDate')?.value}T00:00:00`,
        agencyName: this.paymentForm.get('agencyName')?.value,
        amount: this.paymentForm.get('amount')?.value,
        rib: this.data.rib
      };

      this.accountService.createAccountPayment(payment).subscribe({
        next: (createdPayment) => {
          this.snackBar.open('Payment created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(createdPayment);
        },
        error: (error) => {
          this.snackBar.open(`Error creating payment: ${error.message}`, 'Close', { 
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
