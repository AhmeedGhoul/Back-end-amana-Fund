import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { PoliceService } from '../../../app/services/police.service';
import { Police } from './police.model';
import { PaginationParams, PaginatedResponse } from './pagination.model';

@Component({
  selector: 'app-police',
  templateUrl: './police.component.html',
  styleUrls: ['./police.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    CurrencyPipe
  ]
})
export class PoliceComponent implements OnInit {
  policeList: Police[] = [];
  loading = true;
  error = '';
  displayedColumns: string[] = ['id', 'active', 'start', 'end', 'amount', 'frequency', 'renewalDate', 'userId', 'actions'];
  paginationParams: PaginationParams = {
    page: 0,
    size: 5,
    sortBy: 'start',
    direction: 'asc'
  };
  totalElements = 0;
  totalPages = 0;

  constructor(
    private policeService: PoliceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPolice();
  }

  loadPolice(): void {
    this.loading = true;
    this.policeService.getPaginatedPolice(this.paginationParams).subscribe({
      next: (response: PaginatedResponse<Police>) => {
        this.policeList = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading police data: ' + err.message;
        this.loading = false;
        this.showSnackBar('Error loading police data', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex;
    this.paginationParams.size = event.pageSize;
    this.loadPolice();
  }

  onSortChange(event: Sort): void {
    this.paginationParams.sortBy = event.active as 'start' | 'end';
    this.paginationParams.direction = event.direction as 'asc' | 'desc';
    this.loadPolice();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  deletePolice(id: number): void {
    if (confirm('Are you sure you want to delete this police?')) {
      this.loading = true;
      this.policeService.removePolice(id).subscribe({
        next: () => {
          this.showSnackBar('Police deleted successfully', 'success');
          this.loadPolice();
        },
        error: (error: any) => {
          this.loading = false;
          this.showSnackBar('Error deleting police: ' + error.message, 'error');
        }
      });
    }
  }

  generatePDF(id: number): void {
    this.loading = true;
    this.policeService.generatePDF(id).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `police_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.showSnackBar('Error generating PDF: ' + error.message, 'error');
      }
    });
  }

  deactivatePolice(id: number): void {
    if (confirm('Are you sure you want to change the status of this policy?')) {
      this.loading = true;
      this.policeService.deactivatePolice(id).subscribe({
        next: () => {
          this.snackBar.open('Police deactivated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadPolice();
        },
        error: (error: any) => {
          this.loading = false;
          this.snackBar.open('Error deactivating police: ' + error.message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}