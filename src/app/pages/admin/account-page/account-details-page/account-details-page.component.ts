import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Account, Page } from '@app/models/account.model';
import { AccountService } from '@app/services/account.service';
import { AddAccountDialogComponent } from '../account-details/add-account-dialog/add-account-dialog.component';

@Component({
  selector: 'app-account-details-page',
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
    HttpClientModule
  ],
  templateUrl: './account-details-page.component.html',
  styleUrls: ['./account-details-page.component.scss']
})
export class AccountDetailsPageComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Account>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'rib',
    'clientEmail',
    'accountType',
    'amount', 
    'interestRate',
    'date_Opening',
    'actions'
  ];
  
  dataSource: MatTableDataSource<Account> = new MatTableDataSource<Account>([]);
  
  pageSizeOptions = [5, 10, 25, 100];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts: Account[]) => {
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
        console.error('Error loading accounts:', err);
        this.snackBar.open('Failed to load accounts', 'Close', { 
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  getDisplayAccountType(accountType: string | null | undefined): string {
    const displayAccountTypeMap: { [key: string]: string } = {
      'EPARGNE': 'Épargne',
      'EPARGNE_ZEKET': 'Épargne Zeket'
    };
    return accountType ? displayAccountTypeMap[accountType] || accountType : 'Unknown';
  }

  openAccountDetails(account: Account): void {
    this.dialog.open(AddAccountDialogComponent, {
      width: '800px',
      data: {
        account: account,
        readOnly: true
      }
    });
  }

  deleteAccount(account: Account): void {
    const confirmDelete = confirm(`Are you sure you want to delete the account for ${account.clientEmail}?`);
    
    if (confirmDelete) {
      this.accountService.deleteAccount(account.id).subscribe({
        next: () => {
          this.snackBar.open('Account deleted successfully', 'Close', { 
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          // Reload accounts after deletion
          this.loadAccounts();
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          this.snackBar.open('Failed to delete account', 'Close', { 
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }
}
