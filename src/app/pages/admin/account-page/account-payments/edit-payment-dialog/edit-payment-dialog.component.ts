import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AccountPaymentService } from '@app/services/account-payment.service';
import { AccountPayment } from '@app/models/account-payment.model';

@Component({
  selector: 'app-edit-payment-dialog',
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
    MatNativeDateModule
  ],
  templateUrl: './edit-payment-dialog.component.html',
  styleUrls: ['./edit-payment-dialog.component.scss']
})
export class EditPaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountPaymentService: AccountPaymentService,
    private dialogRef: MatDialogRef<EditPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountPayment
  ) {
    this.paymentForm = this.fb.group({
      paymentDate: [data.paymentDate, Validators.required],
      amount: [data.amount, [Validators.required, Validators.min(0)]],
      agencyName: [data.agencyName, Validators.required],
      rib: [data.rib, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const formData = this.paymentForm.value;
      if (this.data.id != null) {
        const updatedPayment: AccountPayment = {
          ...this.data,
          ...formData
        };
        this.accountPaymentService.updateAccountPayment(updatedPayment).subscribe({
          next: (response: AccountPayment) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error updating payment:', error);
          }
        });
      } else {
        console.error('Cannot update payment: Invalid ID');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}