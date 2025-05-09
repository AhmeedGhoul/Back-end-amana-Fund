import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccountService, PaymentStatisticsDTO } from '@app/services/account.service';
import { Account } from '@app/models/account.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Chart, ChartType, ChartData, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, PointElement, LineElement, BarController } from 'chart.js';
import { AccountPayment } from '@app/models/account-payment.model';
import { AccountPaymentDialogComponent } from '../account-payment-dialog/account-payment-dialog.component';
import {BaseChartDirective} from "ng2-charts";
import { AccountStatsChartComponent } from './account-stats-chart.component';
import { CreditCardAnimationComponent } from '@app/credit-card-animation/credit-card-animation.component';

// Register Chart.js components to avoid 'category is not a registered scale' error
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, PointElement, LineElement, BarController);


@Component({
  selector: 'app-account-full-details',
  templateUrl: './account-full-details.component.html',
  styleUrls: ['./account-full-details.component.scss'],
  standalone: true,
  imports: [
    CreditCardAnimationComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatRippleModule,
    RouterModule,
    DatePipe,
    BaseChartDirective,
    AccountStatsChartComponent
  ]
})
export class AccountFullDetailsComponent implements OnInit, AfterViewInit {
  paymentStats: PaymentStatisticsDTO[] = [];
  statsChartData: ChartData = { labels: [], datasets: [] };
  statsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
  @ViewChild(MatTable) table!: MatTable<Account>;
  @ViewChild(MatSort) sort!: MatSort;

  // Debugging method to log sort state
  logSortState() {
    console.log('Sort Configuration:', {
      active: this.sort?.active,
      direction: this.sort?.direction,
      sortChange: this.sort ? 'Defined' : 'Undefined'
    });
  }
  editableAccount: Partial<Account> = {};
  loading = true;
  accountPayments: AccountPayment[] = [];
  accountPaymentsDataSource: MatTableDataSource<AccountPayment> = new MatTableDataSource<AccountPayment>([]);
  displayedColumns: string[] = [
    'paymentDate',
    'amount',
    'agencyName'
  ];

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const rib = params['rib'];
      this.fetchAccountDetails(rib);
      this.fetchPaymentStatistics(rib);
    });
  }

  ngAfterViewInit(): void {
    // Ensure sort is properly configured
    Promise.resolve().then(() => {
      try {
        // Create sort if not initialized
        if (!this.sort) {
          console.warn('Sort not initialized, creating new MatSort');
          this.sort = new MatSort();
        }

        // Create data source if not initialized
        if (!this.accountPaymentsDataSource) {
          console.warn('AccountPaymentsDataSource not initialized, creating empty data source');
          this.accountPaymentsDataSource = new MatTableDataSource<AccountPayment>([]);
        }

        // Configure sort
        this.sort.active = 'paymentDate';
        this.sort.direction = 'desc';

        // Set custom sorting accessor
        this.accountPaymentsDataSource.sortingDataAccessor = (item: AccountPayment, property: string) => {
          try {
            switch (property) {
              case 'paymentDate':
                return item.paymentDate ? new Date(item.paymentDate).getTime() : 0;
              case 'amount':
                return item.amount ?? 0;
              default:
                return item[property as keyof AccountPayment] ?? '';
            }
          } catch (accessorError) {
            console.error('Error in sorting accessor:', {
              property,
              item,
              error: accessorError
            });
            return 0;
          }
        };

        // Bind sort to data source
        this.accountPaymentsDataSource.sort = this.sort;

        console.log('Sort configured successfully in ngAfterViewInit', {
          sortActive: this.sort.active,
          sortDirection: this.sort.direction,
          dataSourceLength: this.accountPaymentsDataSource.data.length
        });
      } catch (error) {
        console.error('Comprehensive error in ngAfterViewInit sort configuration:', {
          error,
          sort: this.sort,
          dataSource: this.accountPaymentsDataSource
        });
      }
    });
  }

  periodType: string = 'monthly';

  onPeriodTypeChange(): void {
    if (this.account && this.account.rib) {
      this.fetchPaymentStatistics(this.account.rib);
    }
  }

  generateZakatStatusPdf(): void {
    // Strict null checks
    if (!this.account?.rib) {
      this.snackBar.open('No account selected or invalid RIB', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Ensure account type is Zakat before generating PDF
    if (this.account.accountType !== 'EPARGNE_ZEKET') {
      this.snackBar.open('This account is not a Zakat account', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    this.accountService.getZakatStatusPdf(this.account.rib, today).subscribe({
      next: (pdfBlob) => {
        // Safely handle filename generation
        const safeRib = this.account?.rib ?? 'unknown';
        const filename = `zakat_status_${safeRib}_${today}.pdf`;
        saveAs(pdfBlob, filename);
        this.snackBar.open('Zakat Status PDF Generated Successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error generating Zakat Status PDF', error);
        this.snackBar.open('Failed to generate Zakat Status PDF', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  fetchPaymentStatistics(rib: string): void {
    this.accountService.getPaymentStatistics(rib, this.periodType).subscribe({
      next: (stats: PaymentStatisticsDTO[]) => {
        this.paymentStats = stats;
        // Prepare a second dummy dataset for demo purposes (e.g., transaction count)
        const transactionCounts = stats.map(() => Math.floor(Math.random() * 10 + 1));
        this.statsChartData = {
          labels: stats.map(s => s.period),
          datasets: [
            {
              label: 'Total Amount',
              data: stats.map(s => s.totalAmount),
              fill: true,
              borderColor: (ctx: any) => {
                const chart = ctx.chart;
                const {ctx: canvasCtx, chartArea} = chart;
                if (!chartArea) return '#42A5F5';
                const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(66,165,245,0.2)');
                gradient.addColorStop(1, 'rgba(66,165,245,1)');
                return gradient;
              },
              backgroundColor: (ctx: any) => {
                const chart = ctx.chart;
                const {ctx: canvasCtx, chartArea} = chart;
                if (!chartArea) return 'rgba(66,165,245,0.2)';
                const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(66,165,245,0.1)');
                gradient.addColorStop(1, 'rgba(66,165,245,0.5)');
                return gradient;
              },
              pointBackgroundColor: '#fff',
              pointBorderColor: '#42A5F5',
              pointRadius: 6,
              pointHoverRadius: 10,
              tension: 0.4,
              borderWidth: 3,
              order: 1,
              yAxisID: 'y',
            },
            {
              label: 'Transactions',
              data: transactionCounts,
              type: 'bar',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 2,
              order: 2,
              yAxisID: 'y1',
              borderRadius: 8,
              barPercentage: 0.6,
              categoryPercentage: 0.5
            }
          ]
        };
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
        // Sort payments by date in descending order before processing
        const sortedPayments = payments.sort((a, b) => {
          const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
          const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
          return dateB - dateA; // Descending order
        });

        // Preserve original type while ensuring data integrity
        const processedPayments = sortedPayments.map(payment => ({
          ...payment,
          paymentDate: payment.paymentDate || new Date().toISOString(),
          amount: payment.amount ?? 0,
          agencyName: payment.agencyName || 'Unknown'
        }));

        this.accountPayments = processedPayments;
        this.accountPaymentsDataSource = new MatTableDataSource<AccountPayment>(processedPayments);

        // Configure sorting accessor for custom sorting
        this.accountPaymentsDataSource.sortingDataAccessor = (item: AccountPayment, property: string) => {
          switch(property) {
            case 'paymentDate':
              return item.paymentDate ? new Date(item.paymentDate).getTime() : 0;
            case 'amount':
              return item.amount ?? 0;
            case 'agencyName':
              return item.agencyName?.toLowerCase() ?? '';
            default:
              return item[property] ?? '';
          }
        };

        // Configure sort with a slight delay to ensure view is ready
        setTimeout(() => {
          this.configureSort();
        }, 0);

        this.loading = false;
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

  // Method to configure sort
  private configureSort(): void {
    // Ensure sort is configured
    Promise.resolve().then(() => {
      try {
        // Create sort if not initialized
        if (!this.sort) {
          console.warn('Sort not initialized in configureSort, creating new MatSort');
          this.sort = new MatSort();
        }

        // Create data source if not initialized
        if (!this.accountPaymentsDataSource) {
          console.warn('AccountPaymentsDataSource not initialized in configureSort, creating empty data source');
          this.accountPaymentsDataSource = new MatTableDataSource<AccountPayment>([]);
        }

        // Configure sort
        this.sort.active = 'paymentDate';
        this.sort.direction = 'desc';

        // Set custom sorting accessor
        this.accountPaymentsDataSource.sortingDataAccessor = (item: AccountPayment, property: string) => {
          try {
            switch (property) {
              case 'paymentDate':
                return item.paymentDate ? new Date(item.paymentDate).getTime() : 0;
              case 'amount':
                return item.amount ?? 0;
              default:
                return item[property as keyof AccountPayment] ?? '';
            }
          } catch (accessorError) {
            console.error('Error in sorting accessor:', {
              property,
              item,
              error: accessorError
            });
            return 0;
          }
        };

        // Bind sort to data source
        this.accountPaymentsDataSource.sort = this.sort;

        console.log('Sort configured successfully in configureSort', {
          sortActive: this.sort.active,
          sortDirection: this.sort.direction,
          dataSourceLength: this.accountPaymentsDataSource.data.length
        });
      } catch (error) {
        console.error('Comprehensive error in configureSort:', {
          error,
          sort: this.sort,
          dataSource: this.accountPaymentsDataSource
        });
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
