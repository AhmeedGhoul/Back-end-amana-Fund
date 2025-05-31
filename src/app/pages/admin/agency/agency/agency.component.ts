import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger, query, stagger } from '@angular/animations';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services and Models
import { AgencyService } from './agency.service';
import { 
  Agency, 
  AgencyFilters, 
  Governorate, 
  PaginatedAgencyResponse 
} from './agency.model';
import { AddAgencyDialogComponent } from './add-agency-dialog/add-agency-dialog.component';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  standalone: true,
  imports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule
  ],
  styleUrls: ['./agency.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('rowAnimation', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.3s ease-in')
      ]),
      transition('* => void', [
        animate('0.3s ease-out', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class AgencyComponent implements OnInit, AfterViewInit {
  // View Children
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private agencyService: AgencyService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  // Table data
  dataSource = new MatTableDataSource<Agency>([]);
  displayedColumns: string[] = ['select', 'governorate', 'city', 'address', 'phoneNumber', 'email', 'actions'];
  
  @Output() selectionChanged = new EventEmitter<Agency>();
  
  // Pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  totalAgencies = 0;
  
  // Loading state
  isLoading = true;

  // Filters
  filters: AgencyFilters = {
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    governorate: undefined
  };
  
  // Sort state
  sortActive = 'city';
  sortDirection: SortDirection = 'asc';
  
  // Governorate enum for dropdown
  governorates = Object.values(Governorate).filter(
    (value): value is Governorate => typeof value === 'string'
  ) as Governorate[];
  
  searchQuery = '';
  selectedAgency: Agency | null = null;

  ngOnInit(): void {
    this.loadAgencies();
  }

  ngAfterViewInit(): void {
    // Set up the data source with sort and paginator
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    // Initial load
    this.loadAgencies();
  }
  
  // Helper method to get page numbers for pagination
  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.totalAgencies / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  
  // Helper method to get minimum of two numbers
  min(a: number, b: number): number {
    return a < b ? a : b;
  }
  
  // Handle page change event from pagination
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAgencies();
  }
  
  // Handle page size change
  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 0; // Reset to first page when changing page size
    this.loadAgencies();
  }
  
  // Handle row selection
  onRowSelected(agency: Agency, event: MouseEvent): void {
    // Prevent event bubbling to avoid triggering row click when clicking on action buttons
    event.stopPropagation();
    
    // Toggle selection
    const isSameAgency = this.selectedAgency?.id_agency === agency.id_agency;
    this.selectedAgency = isSameAgency ? null : agency;
    
    // Emit the selected agency (or undefined if deselected)
    this.selectionChanged.emit(this.selectedAgency || undefined);
    
    // Add/remove selected class to the row
    const row = (event.target as HTMLElement).closest('tr');
    if (row) {
      if (this.selectedAgency?.id_agency === agency.id_agency) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    }
  }

  loadAgencies(): void {
    this.isLoading = true;
    
    // Reset to first page if filters change
    if (this.paginator && this.currentPage !== 0) {
      this.paginator.firstPage();
    }
    
    this.agencyService.getAllAgencies(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // Handle the API response structure
        if (response && response.content) {
          this.dataSource.data = response.content;
          this.totalAgencies = response.totalElements || 0;
        } else {
          // Fallback in case the response structure is different
          this.dataSource.data = Array.isArray(response) ? response : [];
          this.totalAgencies = Array.isArray(response) ? response.length : 0;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading agencies:', error);
        this.snackBar.open('Failed to load agencies. Please try again.', 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0; // Reset to first page when filters change
    this.loadAgencies();
  }

  resetFilters(): void {
    this.filters = {
      address: '',
      city: '',
      phoneNumber: '',
      email: '',
      governorate: undefined
    };
    this.applyFilters();
  }

  sortData(sort: Sort): void {
    this.sortActive = sort.active;
    this.sortDirection = sort.direction as 'asc' | 'desc';
    this.loadAgencies();
  }

  openAddAgencyDialog(agency?: Agency): void {
    const dialogRef = this.dialog.open(AddAgencyDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      data: agency ? { ...agency } : null
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const message = agency ? 'Agency updated successfully!' : 'Agency added successfully!';
        this.snackBar.open(message, 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadAgencies();
      }
    });
  }

  generateReport(): void {
    this.isLoading = true;
    this.agencyService.generateAgencyReport().subscribe({
      next: (response: Blob) => {
        // Handle file download
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agency-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Report generated successfully!', 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error generating report:', error);
        this.snackBar.open('Failed to generate report. Please try again.', 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  deleteAgency(agency: Agency): void {
    // Use browser's built-in confirm dialog as a fallback
    const confirmed = confirm(`Are you sure you want to delete the agency at ${agency.address}?`);
    
    if (confirmed) {
      this.isLoading = true;
      this.agencyService.deleteAgency(agency).subscribe({
        next: () => {
          this.snackBar.open('Agency deleted successfully!', 'Dismiss', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadAgencies();
        },
        error: (error: any) => {
          console.error('Error deleting agency:', error);
          this.snackBar.open('Failed to delete agency. Please try again.', 'Dismiss', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  viewAgencyDetails(agency: Agency): void {
    // You can implement a detailed view dialog here
    this.openAddAgencyDialog(agency);
  }
  
  editAgency(agency: Agency): void {
    this.openAddAgencyDialog(agency);
  }

  selectAgency(agency: Agency): void {
    this.selectionChanged.emit(agency);
  }

  onAgencySelectionChanged(agency: Agency): void {
    this.selectedAgency = agency;
  }

  onRequestSelectionChanged(request: any): void {
    console.log('Selected request:', request);
  }
}
