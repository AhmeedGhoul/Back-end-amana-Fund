import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Account } from '@app/models/account.model';
import { AddAccountDialogComponent } from './add-account-dialog/add-account-dialog.component';
import { AccountActionsComponent } from './account-actions/account-actions.component';

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
    AccountActionsComponent
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Account>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['date_Opening', 'accountType', 'amount', 'rib', 'interestRate', 'actions'];
  dataSource: Account[] = [];
  accountTypes = ['EPARGNE', 'EPARGNE_ZEKET'];
  selectedType: string | null = null;
  searchTerm: string = '';
  selectedAccount: Account | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.http.get<Account[]>('http://localhost:8080/api/v1/Account')
      .subscribe({
        next: (accounts: Account[]) => {
          this.dataSource = accounts;
          if (this.table) {
            this.table.renderRows();
          }
        },
        error: (error: any) => {
          console.error('Error loading accounts:', error);
        }
      });
  }

  addAccount(): void {
    const dialogRef = this.dialog.open(AddAccountDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  editAccount(account: Account): void {
    // TODO: Implement edit functionality
  }

  deleteAccount(account: Account): void {
    // TODO: Implement delete functionality
  }

  selectAccount(account: Account): void {
    this.selectedAccount = account;
  }

  applyFilters(): void {
    let filteredData = [...this.dataSource];

    if (this.selectedType) {
      filteredData = filteredData.filter(account => account.accountType === this.selectedType);
    }

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(account => 
        account.rib.toLowerCase().includes(searchLower)
      );
    }

    this.dataSource = filteredData;
    if (this.table) {
      this.table.renderRows();
    }
  }
}
