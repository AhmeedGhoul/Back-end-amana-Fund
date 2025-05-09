import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '@app/models/Payment';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe
  ]
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  newPayment: Payment = new Payment();
  showAddForm = false;
  isLoading = false;
  displayedColumns: string[] = ['date', 'agent', 'amount', 'status', 'actions'];
  isEditing: boolean = false;
  selectedPayment: Payment | null = null;
  error: string | null = null;

  // Form controls
  agentCtrl = new FormControl('', Validators.required);
  amountCtrl = new FormControl(0, [Validators.required, Validators.min(0.01)]);
  dateCtrl = new FormControl(new Date(), Validators.required);
  statusCtrl = new FormControl('pending', Validators.required);



  constructor(
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {
    this.loadPayments();
  }

  selectPayment(payment: Payment): void {
    this.isEditing = true;
    this.selectedPayment = payment;
    this.agentCtrl.setValue(payment.agent);
    this.amountCtrl.setValue(payment.amount);
    this.dateCtrl.setValue(payment.date_payment);
    this.statusCtrl.setValue(payment.status ? 'completed' : 'pending');
  }

  ngOnInit(): void {
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.snackBar.open('Failed to load payments', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }


  createPayment(): void {
    if (!this.newPayment.amount || !this.newPayment.date_payment || !this.newPayment.agent) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    this.paymentService.createPayment(this.newPayment).subscribe({
      next: (payment) => {
        this.payments.unshift(payment);
        this.resetForm();
        this.snackBar.open('Payment created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error creating payment:', error);
        this.snackBar.open('Failed to create payment', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  updatePayment(payment: Payment): void {
    if (!payment) {
      this.setError('No payment selected for update');
      return;
    }

    const updatedPayment = new Payment({
      id_payment: payment.id_payment,
      agent: this.agentCtrl.value || payment.agent,
      amount: this.amountCtrl.value || payment.amount,
      date_payment: this.dateCtrl.value || payment.date_payment,
      status: this.statusCtrl.value === 'completed' ? true : false
    });

    this.paymentService.updatePayment(updatedPayment).subscribe({
      next: (updated) => {
        this.snackBar.open('Payment updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadPayments();
      },
      error: (error) => {
        console.error('Error updating payment:', error);
        this.snackBar.open('Failed to update payment', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
    });
  }

  deletePayment(payment: Payment): void {
    if (!confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    this.isLoading = true;
    this.paymentService.deletePayment(payment.id_payment!).subscribe({
      next: () => {
        this.payments = this.payments.filter(p => p.id_payment !== payment.id_payment);
        this.snackBar.open('Payment deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.clearError();
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
        this.setError('Failed to delete payment');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.newPayment = new Payment();
    this.showAddForm = false;
  }

  cancelEdit(): void {
    this.selectedPayment = null;
    this.isEditing = false;
  }

  setError(message: string): void {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  clearError(): void {
    this.error = null;
  }



  validatePayment(payment: any): boolean {
    return payment &&
      payment.amount !== null &&
      payment.amount !== undefined &&
      payment.date_payment !== null &&
      payment.date_payment !== undefined;
  }
}
