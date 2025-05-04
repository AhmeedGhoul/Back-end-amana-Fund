import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { AccountPaymentService } from '@app/services/account-payment.service';
import { AccountPayment } from '@app/models/account-payment.model';
import { AddPaymentDialogComponent } from './add-payment-dialog/add-payment-dialog.component';
import { EditPaymentDialogComponent } from './edit-payment-dialog/edit-payment-dialog.component';

@Component({
  selector: 'app-account-payments',
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
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './account-payments.component.html',
  styleUrls: ['./account-payments.component.scss']
})
export class AccountPaymentsComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<AccountPayment>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'paymentDate', 'amount', 'agencyName', 'rib', 'actions'];
  dataSource: AccountPayment[] = [];
  searchTerm: string = '';
  selectedPayment: AccountPayment | null = null;
  filterForm: FormGroup;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private fb: FormBuilder,
    private accountPaymentService: AccountPaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      agencyName: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  goBack(): void {
    this.router.navigate(['/admin/account']);
  }

  clearField(fieldName: string): void {
    this.filterForm.get(fieldName)?.setValue('');
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadPayments();
    this.snackBar.open('Filters have been reset', 'Close', { duration: 3000 });
  }

  loadPayments(): void {
    this.accountPaymentService.getAccountPaymentsPaged(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.dataSource = response.content;
        this.totalItems = response.totalElements;
        if (this.table) {
          this.table.renderRows();
        }
      },
      error: (error: any) => {
        console.error('Error loading payments:', error);
        this.snackBar.open('Error loading payments', 'Close', { duration: 3000 });
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddPaymentDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPayments();
      }
    });
  }

  openEditDialog(payment: AccountPayment): void {
    const dialogRef = this.dialog.open(EditPaymentDialogComponent, {
      width: '500px',
      data: payment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPayments();
      }
    });
  }

  deletePayment(payment: AccountPayment): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      if (payment.id != null) {
        this.accountPaymentService.deleteAccountPayment(payment.id).subscribe({
          next: () => {
            this.snackBar.open('Payment deleted successfully', 'Close', { duration: 3000 });
            this.loadPayments();
          },
          error: (error) => {
            this.snackBar.open(`Error deleting payment: ${error.message}`, 'Close', { duration: 3000 });
          }
        });
      } else {
        this.snackBar.open('Cannot delete payment: Invalid ID', 'Close', { duration: 3000 });
      }
    }
  }

  applyFilters(): void {
    const { agencyName, startDate, endDate } = this.filterForm.value;
    
    if (agencyName) {
      this.accountPaymentService.getAccountPaymentsByAgency(agencyName).subscribe({
        next: (payments: AccountPayment[]) => {
          this.dataSource = payments;
          if (this.table) {
            this.table.renderRows();
          }
        },
        error: (error: any) => {
          console.error('Error filtering by agency:', error);
          this.snackBar.open('Error filtering by agency', 'Close', { duration: 3000 });
        }
      });
    } else if (startDate && endDate) {
      this.accountPaymentService.getAccountPaymentsByDateRange(startDate, endDate).subscribe({
        next: (payments: AccountPayment[]) => {
          this.dataSource = payments;
          if (this.table) {
            this.table.renderRows();
          }
        },
        error: (error: any) => {
          console.error('Error filtering by date range:', error);
          this.snackBar.open('Error filtering by date range', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.loadPayments();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPayments();
  }
} 