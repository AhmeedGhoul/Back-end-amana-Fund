import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, Pipe, PipeTransform, Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';

// Import models and enums
import { Product } from './request.model';

export interface Request {
  id_request?: number;
  date_Request: string;  // ISO date string
  dateRequest?: Date | string;  // For backward compatibility
  product: Product;
  document: string;
  user: any;
  agencyId?: number;
  // Add other properties as needed
}

// Import Agency from the actual model
import { Agency } from '../agency/agency.model';

// Mock RequestService - replace with actual service
@Injectable({
  providedIn: 'root'
})
class RequestService {
  // Mock implementation - replace with actual service methods
  searchRequests(query: any, page: number, size: number): any {
    // Mock implementation
    return of({
      content: [],
      totalElements: 0
    });
  }
  
  deleteRequest(request: Request): any {
    // Mock implementation
    return of({});
  }
  
  generateRequestReport(): any {
    // Mock implementation
    return of(new Blob());
  }
}

// Mock AddRequestDialogComponent - replace with actual component
@Component({
  selector: 'app-add-request-dialog',
  template: '<div>Add Request Dialog</div>'
})
class AddRequestDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

// TimeAgoPipe implementation
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  standalone: true,
  imports: [
    // Angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Material modules
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    
    // Pipes
    DatePipe,
    TimeAgoPipe
  ]
})
export class RequestComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource = new MatTableDataSource<Request>([]);
  loading = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  currentPage = 0;
  totalRequests = 0;
  filtersForm: FormGroup;
  
  productList = Object.values(Product);
  productLabels = {
    [Product.JAM3EYA]: 'JAM3EYA',
    [Product.EPARGNE]: 'EPARGNE',
    [Product.EPARGNE_ZEKET]: 'EPARGNE ZEKET'
  };

  displayedColumns: string[] = ['select', 'product', 'document', 'dateRequest', 'actions'];
  selection = new SelectionModel<Request>(false, []);
  sortActive = 'dateRequest';
  sortDirection: 'asc' | 'desc' = 'desc';

  @Input() selectedAgency: Agency | null = null;
  @Output() requestSelected = new EventEmitter<Request | null>();

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar
  ) {
    this.filtersForm = this.fb.group({
      document: [''],
      product: [''],
      dateRequest: [null]
    });
  }

  ngOnInit(): void {
    this.loadRequests();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    // Handle sorting
    this.sort.sortChange.subscribe(() => {
      this.currentPage = 0;
      this.loadRequests();
    });
  }

  loadRequests(): void {
    this.loading = true;
    
    // Build query parameters from form values
    const query: any = {};
    const formValue = this.filtersForm.value;
    
    // Add sorting
    const sortField = this.sort?.active || 'date_Request';
    const sortDirection = (this.sort?.direction as SortDirection) || 'desc';
    query.sort = `${sortField},${sortDirection}`;
    
    // Add filters
    if (formValue.document) {
      query.document = formValue.document;
    }
    
    if (formValue.product) {
      query.product = formValue.product;
    }
    
    if (formValue.dateRequest) {
      const date = formValue.dateRequest instanceof Date ? 
                 formValue.dateRequest : new Date(formValue.dateRequest);
      query.date_Request = date.toISOString().split('T')[0];
    }
    
    // If we have a selected agency, filter by it
    if (this.selectedAgency?.id_agency) {
      query.agencyId = this.selectedAgency.id_agency;
    }
    
    this.requestService.searchRequests(query, this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        // Map the response to our component's Request interface
        const requests = res.content.map((request: any) => ({
          ...request,
          id_request: request.id_request || request.id,  // Handle both id and id_request
          dateRequest: request.date_Request ? new Date(request.date_Request) : null,
          date_Request: request.date_Request
        }));
        
        this.dataSource.data = requests;
        this.totalRequests = res.totalElements;
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading requests:', err);
        this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRequests();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadRequests();
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    const formValue = this.filtersForm.value;
    return Object.values(formValue).some(value => 
      value !== null && value !== undefined && value !== ''
    );
  }

  openAddRequestDialog(): void {
    const dialogRef = this.dialog.open(AddRequestDialogComponent, {
      width: '600px',
      data: { agency: this.selectedAgency }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  editRequest(request: Request): void {
    const dialogRef = this.dialog.open(AddRequestDialogComponent, {
      width: '600px',
      data: { 
        request: request,
        agency: this.selectedAgency
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  deleteRequest(request: Request): void {
    const confirmDelete = confirm('Are you sure you want to delete this request?');
    if (confirmDelete) {
      this.requestService.deleteRequest(request).subscribe({
        next: () => {
          this.snackBar.open('Request deleted successfully', 'Close', { duration: 3000 });
          this.loadRequests();
        },
        error: (err: Error) => {
          console.error('Error deleting request:', err);
          this.snackBar.open('Failed to delete request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  generateReport(): void {
    this.loading = true;
    this.requestService.generateRequestReport().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `requests-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error generating report:', err);
        this.snackBar.open('Failed to generate report', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onRowClick(request: Request): void {
    this.selection.toggle(request);
    this.requestSelected.emit(this.selection.isSelected(request) ? request : null);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getProductLabel(product: Product): string {
    return this.productLabels[product] || product;
  }
}
