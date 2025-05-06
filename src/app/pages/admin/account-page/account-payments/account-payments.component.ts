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

  displayedColumns: string[] = ['paymentDate', 'amount', 'agencyName', 'rib', 'actions'];
  dataSource: AccountPayment[] = [];
  searchTerm: string = '';
  selectedPayment: AccountPayment | null = null;
  filterForm: FormGroup;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;

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
    this.loading = true;
    this.accountPaymentService.getAccountPaymentsPaged(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        if (response && response.content) {
          this.dataSource = response.content;
          this.totalItems = response.totalElements;
        } else {
          this.dataSource = [];
          this.totalItems = 0;
          this.snackBar.open('No payments found.', 'Close', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Detailed error loading payments:', error);
        this.loading = false;
        this.dataSource = [];
        this.totalItems = 0;
        
        let errorMessage = 'Failed to load payments.';
        if (error.message) {
          errorMessage += ` ${error.message}`;
        }
        
        this.snackBar.open(errorMessage, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar'] 
        });
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
    
    // Validate inputs
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        this.snackBar.open('Invalid date range', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
        return;
      }
    }

    // Combined filtering logic
    const params: any = {};
    if (agencyName?.trim()) params.agencyName = agencyName.trim();
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    if (Object.keys(params).length > 0) {
      // If any filter is applied
      this.loading = true;
      
      // Combine filtering methods
      this.accountPaymentService.getAccountPayments().subscribe({
        next: (allPayments: AccountPayment[]) => {
          this.dataSource = allPayments.filter(payment => {
            const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : null;
            
            const matchesAgency = !params.agencyName || 
              payment.agencyName.toLowerCase().includes(params.agencyName.toLowerCase());
            
            const matchesDateRange = (!params.startDate || !paymentDate || paymentDate >= new Date(params.startDate)) && 
                                     (!params.endDate || !paymentDate || paymentDate <= new Date(params.endDate));
            
            return matchesAgency && matchesDateRange;
          });

          this.loading = false;
          if (this.dataSource.length === 0) {
            this.snackBar.open('No payments found matching the filters', 'Close', { duration: 3000 });
          }

          if (this.table) {
            this.table.renderRows();
          }
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Error filtering payments:', error);
          this.snackBar.open('Failed to filter payments', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
        }
      });
    } else {
      // If no filters, load default payments
      this.loadPayments();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPayments();
  }
} 