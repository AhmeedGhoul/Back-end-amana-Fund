import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Account, Page } from '@app/models/account.model';
import { AddAccountDialogComponent } from './add-account-dialog/add-account-dialog.component';
import { AccountActionsComponent } from './account-actions/account-actions.component';
import { AccountService } from '../../../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCardModule,
    HttpClientModule,
    RouterModule,
    RouterLink,
    AccountActionsComponent
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<Account>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ribError = false;
  ribErrorMessage = '';

  displayedColumns: string[] = [
    'rib',
    'accountType',
    'amount',
    'actions'
  ];
  
  dataSource: MatTableDataSource<Account> = new MatTableDataSource<Account>([]);
  accountTypes = ['EPARGNE', 'EPARGNE_ZEKET'];
  selectedType: string | null = null;
  searchTerm: string = '';
  selectedAccountType: string = '';
  selectedAccount: Account | null = null;
  pageSizeOptions = [5, 10, 25, 100];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  resetSearch() {
    // Reset search term, RIB error, and reload all accounts
    this.searchTerm = '';
    this.ribError = false;
    this.ribErrorMessage = '';
    this.loadAccounts();
  }

  validateRib(): boolean {
    // If search term is empty or just 'TN', reset and show all accounts
    if (!this.searchTerm || this.searchTerm.trim() === '' || this.searchTerm.trim() === 'TN') {
      this.searchTerm = '';
      this.ribError = false;
      this.ribErrorMessage = '';
      this.loadAccounts(); // Reload all accounts
      return false;
    }

    // Ensure RIB starts with TN and has exactly 17 characters (TN + 15 digits)
    const ribRegex = /^TN\d{15}$/;
    
    // Remove any non-digit characters except 'TN'
    let cleanedRib = this.searchTerm.replace(/[^0-9]/g, '');
    
    // Always prepend 'TN' if not already present
    cleanedRib = 'TN' + cleanedRib;
    
    // Update search term with exact input (no padding)
    this.searchTerm = cleanedRib;
    
    // Validate RIB format
    if (!ribRegex.test(cleanedRib)) {
      this.ribError = true;
      this.ribErrorMessage = 'RIB must be 17 characters: TN followed by 15 digits';
      return false;
    }
    
    // Validate RIB existence
    this.validateRibExistence(cleanedRib);
    
    return true;
  }

  validateRibExistence(rib: string) {
    this.accountService.filterAccountsByRib(rib).subscribe({
      next: (accounts) => {
        if (accounts.length === 0) {
          this.ribError = true;
          this.ribErrorMessage = 'RIB does not exist';
          this.dataSource.data = []; // Clear data source
          this.totalElements = 0;
        } else {
          // Check if filtered accounts match the selected account type
          const filteredAccounts = this.selectedAccountType 
            ? accounts.filter(account => account.accountType === this.selectedAccountType)
            : accounts;

          if (filteredAccounts.length === 0) {
            this.ribError = true;
            this.ribErrorMessage = `No ${this.selectedAccountType} accounts found for this RIB`;
            this.dataSource.data = [];
            this.totalElements = 0;
          } else {
            this.ribError = false;
            this.ribErrorMessage = '';
            this.dataSource.data = filteredAccounts;
            this.totalElements = filteredAccounts.length;
          }
        }
      },
      error: (err) => {
        console.error('RIB validation error:', err);
        // If error is due to server issues, allow proceeding
        if (err.status === 500 || err.status === 0) {
          this.ribError = false;
          this.ribErrorMessage = '';
        } else {
          this.ribError = true;
          this.ribErrorMessage = err.message || 'Error validating RIB';
          this.dataSource.data = []; // Clear data source
          this.totalElements = 0;
        }
      }
    });
  }

  // Mapping to handle display vs backend enum
  private accountTypeMap: { [key: string]: string } = {
    'EPARGNE': 'EPARGNE',
    'EPARGNE_ZEKET': 'EPARGNE_ZEKET'
  };
  private displayAccountTypeMap: { [key: string]: string } = {
    'EPARGNE': 'Épargne',
    'EPARGNE_ZEKET': 'Épargne Zeket'
  };

  getDisplayAccountType(accountType: string | null | undefined): string {
    if (!accountType) return 'Unknown';
    return this.displayAccountTypeMap[accountType] || accountType;
  }

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  openAccountDetails(account: Account) {
    // Navigate to full account details page
    if (account.rib) {
      this.router.navigate(['/admin/accounts/details', account.rib]);
    } else {
      this.snackBar.open('Cannot view account details: RIB is missing', 'Close', { duration: 3000 });
    }
  }

  private getHeaders() {
    // Implement headers retrieval logic
    return {}; // Default empty headers
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadAccounts();
  }

  loadAccounts(): void {
    // If no search term or just 'TN', load all accounts
    if (!this.searchTerm || this.searchTerm.trim() === '' || this.searchTerm.trim() === 'TN') {
      this.searchTerm = '';
      this.ribError = false;
      this.ribErrorMessage = '';
    }
    
    const headers = this.getHeaders();
    const pageRequest = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: this.sort?.active || 'date_Opening',
      sortDir: this.sort?.direction || 'desc'
    };

    // Apply filters
    const filterParams: { [key: string]: string } = {};
    if (this.selectedAccountType) {
      filterParams['accountType'] = this.selectedAccountType;
    }
    // Only add RIB filter if it's a valid RIB (not just 'TN')
    if (this.searchTerm && this.searchTerm !== 'TN' && this.searchTerm.length > 2) {
      filterParams['rib'] = this.searchTerm;
    }

    // Check if any filter is applied
    if (this.selectedType) {
      // Map display type to backend enum
      const accountTypeMap: { [key: string]: string } = {
        'EPARGNE': 'EPARGNE',
        'EPARGNE_ZEKET': 'EPARGNE_ZEKET'
      };
      const backendAccountType = accountTypeMap[this.selectedType];

      this.accountService.filterAccountsByType(backendAccountType).subscribe({
        next: (accounts: Account[]) => {
          console.log('Filtered accounts by type:', accounts);
          this.dataSource.data = accounts.map(account => ({
            ...account,
            displayAccountType: this.getDisplayAccountType(account.accountType)
          }));
          this.totalElements = accounts.length;
          if (this.table) {
            this.table.renderRows();
          }
        },
        error: (err) => {
          console.error('Account type filtering error:', err);
          this.handleError(err);
        }
      });
    } else if (this.searchTerm) {
      // If RIB search term is present, use RIB filtering
      this.accountService.filterAccountsByRib(this.searchTerm).subscribe({
        next: (accounts: Account[]) => {
          console.log('Filtered accounts by RIB:', accounts);
          
          if (accounts.length > 0) {
            // If accounts found, update the datasource
            this.dataSource.data = accounts.map(account => ({
              ...account,
              displayAccountType: this.getDisplayAccountType(account.accountType)
            }));
            this.totalElements = accounts.length;
            if (this.table) {
              this.table.renderRows();
            }
          } else {
            // Clear datasource if no accounts found
            this.dataSource.data = [];
            this.totalElements = 0;
            if (this.table) {
              this.table.renderRows();
            }
            
            // Show a message if no accounts found
            this.snackBar.open(`No account found with RIB: ${this.searchTerm}`, 'Close', {
              duration: 3000,
              panelClass: ['warning-snackbar']
            });
          }
        },
        error: (err) => {
          console.error('Account RIB filtering error:', err);
          
          // Clear datasource on error
          this.dataSource.data = [];
          this.totalElements = 0;
          if (this.table) {
            this.table.renderRows();
          }
          
          // Show detailed error message
          this.snackBar.open(err.message || `Error finding account with RIB: ${this.searchTerm}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          
          // Call error handling service if needed
          this.handleError(err);
        }
      });
    } else {
      // If no type or RIB selected, use default paged accounts
      const params: any = {
        page: this.paginator?.pageIndex || 0,
        size: this.paginator?.pageSize || 10
      };

      console.log('Fetching accounts with params:', params);

      this.accountService.getAccounts(params).subscribe({
        next: (response: Page<Account>) => {
          console.log('Accounts retrieved successfully:', response);
          // Map backend enum to display type
          this.dataSource.data = response.content.map(account => ({
            ...account,
            displayAccountType: this.getDisplayAccountType(account.accountType)
          }));
          this.totalElements = response.totalElements;
          if (this.table) {
            this.table.renderRows();
          }
        },
        error: (err) => {
          console.error('Full error details:', err);
          this.handleError(err);
        }
      });
    }
  }

  addAccount(): void {
    const dialogRef = this.dialog.open(AddAccountDialogComponent, {
      width: '500px',
      data: { clientEmail: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  editAccount(account: Account): void {
    // Implement edit functionality
    this.snackBar.open('Edit feature not implemented yet', 'Close', { duration: 3000 });
  }

  deleteAccount(account: Account): void {
    if (confirm(`Are you sure you want to delete account ${account.rib}?`)) {
      this.accountService.deleteAccount(account.id!).subscribe({
        next: () => {
          this.loadAccounts();
          this.snackBar.open('Account deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  applyFilters(): void {
    // Trigger server-side filtering
    this.loadAccounts();
  }

  private handleError(error: any): void {
    console.error('Detailed error information:', {
      status: error.status,
      message: error.message,
      errorBody: error.error,
      url: error.url
    });

    let errorMessage = 'An unexpected error occurred';

    // More detailed error handling
    if (error.status === 500) {
      errorMessage = 'Server error. Please contact support.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid request parameters';
    } else if (error.status === 404) {
      errorMessage = 'Requested resource not found';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });

    // Reset data source to prevent empty view
    this.dataSource.data = [];
    this.totalElements = 0;
    if (this.table) {
      this.table.renderRows();
    }
  }
}