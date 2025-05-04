import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { Account } from '@app/models/account.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-full-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './account-full-details.component.html',
  styleUrls: ['./account-full-details.component.css']
})
export class AccountFullDetailsComponent implements OnInit {
  account: Account | null = null;
  loading = true;
  isEditMode = false;
  editableAccount: Partial<Account> = {};
  accountDetails: { attribute: string, value: string }[] = [];
  displayedColumns: string[] = [
    'attribute',
    'value'
  ];

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const rib = params['rib'];
      this.fetchAccountDetails(rib);
    });
  }

  fetchAccountDetails(rib: string): void {
    this.loading = true;
    this.accountService.getAccountByRib(rib).subscribe({
      next: (account: Account) => {
        this.account = account;
        this.prepareAccountDetails();
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error fetching account details', error);
        this.loading = false;
        this.snackBar.open('Failed to load account details', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
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

    // Prepare the account object for update
    const updatedAccount: Account = {
      id: this.account.id,
      date_Opening: this.account.date_Opening,
      accountType: this.account.accountType,
      rib: this.account.rib,
      amount: this.editableAccount.amount ?? this.account.amount,
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
}
