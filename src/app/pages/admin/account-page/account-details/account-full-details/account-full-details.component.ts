import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccountService, PaymentStatisticsDTO } from '@app/services/account.service';
import { Account } from '@app/models/account.model';
import { ChartType, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AccountPayment } from '@app/models/account-payment.model';
import { AccountPaymentDialogComponent } from '../account-payment-dialog/account-payment-dialog.component';

@Component({
  selector: 'app-account-full-details',
  templateUrl: './account-full-details.component.html',
  styleUrls: ['./account-full-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    MatRippleModule,
    RouterModule,
    DatePipe,
    CurrencyPipe,
    AccountPaymentDialogComponent
  ]
})
export class AccountFullDetailsComponent implements OnInit {
  paymentStats: PaymentStatisticsDTO[] = [];
  statsChartData: ChartData = { labels: [], datasets: [] };
  statsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
      },
      title: {
        display: true,
        text: 'Payment Statistics (Analytics)',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Period',
        },
        grid: {
          display: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount',
        },
        grid: {
          display: true,
        },
      },
    },
  };

  // Removed chartTypes array and statsChartType property

  account: Account | null = null;
  accountDetails: { attribute: string; value: string }[] = [];
  isEditMode = false;
  editableAccount: Partial<Account> = {};
  loading = true;
  accountPayments: AccountPayment[] = [];
  displayedColumns: string[] = [
    'paymentDate',
    'amount',
    'agencyName'
  ];

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const rib = params['rib'];
      this.fetchAccountDetails(rib);
      this.fetchPaymentStatistics(rib);
    });
  }

  periodType: string = 'monthly';

  onPeriodTypeChange(): void {
    if (this.account && this.account.rib) {
      this.fetchPaymentStatistics(this.account.rib);
    }
  }

  fetchPaymentStatistics(rib: string): void {
    this.accountService.getPaymentStatistics(rib, this.periodType).subscribe({
      next: (stats: PaymentStatisticsDTO[]) => {
        this.paymentStats = stats;
        this.statsChartData = {
          labels: stats.map(s => s.period),
          datasets: [{
            label: 'Payments by Month',
            data: stats.map(s => s.totalAmount),
            backgroundColor: '#42A5F5'
          }]
        };
        console.log('statsChartData', this.statsChartData); // Debug chart data
        if (!stats.length) {
          console.warn('No payment statistics returned from API.');
        }
      },
      error: (err) => {
        console.error('Failed to load payment statistics', err);
      }
    });
  }


  fetchAccountDetails(rib: string): void {
    this.loading = true;
    this.accountService.getAccountByRib(rib).subscribe({
      next: (account: Account) => {
        this.account = account;
        this.prepareAccountDetails();
        this.fetchAccountPayments(rib);
      },
      error: (error: Error) => {
        console.error('Error fetching account details', error);
        this.loading = false;
        this.snackBar.open('Failed to load account details', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
      }
    });
  }

  fetchAccountPayments(rib: string): void {
    this.accountService.getAccountPaymentsByRib(rib).subscribe({
      next: (payments: AccountPayment[]) => {
        this.accountPayments = payments;
        this.loading = false;
        console.log('Account Payments:', payments);
      },
      error: (error: any) => {
        console.error('Detailed Error fetching account payments', {
          errorMessage: error.message,
          errorObject: error,
          rib: rib
        });
        this.loading = false;
        const errorMsg = error.error?.message || error.message || 'Failed to load account payments';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    });
  }

  openPaymentDialog(): void {
    const accountRib = this.account?.rib;
    if (!accountRib) {
      this.snackBar.open('No account RIB available', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
      return;
    }

    const dialogRef = this.dialog.open(AccountPaymentDialogComponent, {
      width: '400px',
      data: { rib: accountRib }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refetch account details to update amount
        this.fetchAccountDetails(accountRib);

        // Add the new payment to the list
        if (result && typeof result === 'object' && 'amount' in result && 'paymentDate' in result) {
          this.accountPayments = [...this.accountPayments, result as AccountPayment];
        }
      }
    });
  }

  prepareAccountDetails(): void {
    if (!this.account) return;

    console.log('Full Account Details:', JSON.stringify(this.account, null, 2));

    this.accountDetails = [
      { attribute: 'RIB', value: this.account.rib || 'N/A' },
      { attribute: 'Account Type', value: this.account.accountType || 'N/A' },
      { attribute: 'Amount', value: this.account.amount != null ? `${this.account.amount} TND` : 'N/A' },
      { attribute: 'Opening Date', value: this.account.date_Opening ? new Date(this.account.date_Opening).toLocaleString() : 'N/A' },
      { attribute: 'Client Email', value: this.account.clientEmail || 'N/A' },
      { attribute: 'Interest Rate', value: this.account.interestRate != null ? `${this.account.interestRate * 100}%` : 'N/A' },
      { attribute: 'Eligible for Zakat', value: this.account.eligibleForZakat != null ? (this.account.eligibleForZakat ? 'Yes' : 'No') : 'N/A' },
      { attribute: 'Nissab Reached Date', value: this.account.nissabReachedDate || 'N/A' },
      { attribute: 'Zakat Transactions', value: this.account.zakatTransactions?.length ? `${this.account.zakatTransactions.length} transactions` : 'No transactions' }
    ];
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.account) {
      this.editableAccount = { ...this.account };
    }
  }

  isEditableField(attribute: string): boolean {
    const editableFields = ['Amount', 'Client Email'];
    return editableFields.includes(attribute);
  }

  saveAccountChanges(): void {
    if (!this.account) return;

    // Calculate the payment amount if it has changed
    const oldAmount = this.account.amount ?? 0;
    const newAmount = this.editableAccount.amount ?? this.account.amount ?? 0;
    const amountDifference = newAmount - oldAmount;

    // Prepare the account object for update
    const updatedAccount: Account = {
      id: this.account.id,
      date_Opening: this.account.date_Opening,
      accountType: this.account.accountType,
      rib: this.account.rib,
      amount: newAmount,
      clientEmail: this.editableAccount.clientEmail ?? this.account.clientEmail,
      
      // Preserve existing attributes
      agent: this.account.agent,
      zakatTransactions: this.account.zakatTransactions,
      zakatTransactionDates: this.account.zakatTransactionDates,
      nissabReachedDate: this.account.nissabReachedDate,
      interestRate: this.account.interestRate,
      eligibleForZakat: this.account.eligibleForZakat
    };

    console.log('Attempting to update account:', JSON.stringify(updatedAccount, null, 2));

    this.accountService.updateAccount(updatedAccount).subscribe({
      next: (updatedAccount: Account) => {
        this.account = updatedAccount;
        this.prepareAccountDetails();
        this.isEditMode = false;
        this.snackBar.open('Account updated successfully', 'Close', { duration: 3000 });

        // If there's a payment difference, add it to the account payments
        if (amountDifference !== 0) {
          const newPayment: AccountPayment = {
            amount: amountDifference,
            paymentDate: new Date().toISOString(),
            agencyName: 'system',
            rib: this.account.rib || '' // Provide a default empty string
          };
          this.accountPayments = [...this.accountPayments, newPayment];
        }
      },
      error: (error: any) => {
        console.error('Full error object:', error);
        
        // Extract more detailed error information
        const errorMessage = error.error?.message || 
                            error.message || 
                            'Failed to update account';
        const errorDetails = error.error?.details || 'No additional details';
        
        console.error('Error updating account:', {
          status: error.status,
          message: errorMessage,
          details: errorDetails,
          headers: error.headers?.keys()
        });
        
        this.snackBar.open(`Update Failed: ${errorMessage}`, 'Close', { 
          duration: 5000, 
          panelClass: 'error-snackbar' 
        });
      }
    });
  }

  cancelEditMode(): void {
    this.isEditMode = false;
    this.editableAccount = {};
  }

  sendAccountEmail(): void {
    if (!this.account || !this.account.rib) {
      this.snackBar.open('No account selected', 'Close', { duration: 3000 } as MatSnackBarConfig);
      return;
    }

    this.accountService.sendAccountEmail(this.account.rib).subscribe({
      next: () => {
        this.snackBar.open('Account details sent via email', 'Close', { duration: 3000 } as MatSnackBarConfig);
      },
      error: (error) => {
        console.error('Error sending account email:', error);
        this.snackBar.open('Failed to send account details', 'Close', { 
          duration: 5000,
          panelClass: 'error-snackbar'
        } as MatSnackBarConfig);
      }
    });
  }
}
