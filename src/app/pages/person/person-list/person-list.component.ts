import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PersonService } from '../../../services/person.service';
import { Person } from '../person.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PersonComponent } from '../person.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {
  expandedPersonId: number | null = null; // Track which person's PDF is expanded

  displayedColumns: string[] = ['name', 'lastName', 'cin', 'email', 'age', 'revenue', 'active', 'documents', 'actions'];
  dataSource: any[] = [];
  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  sortField: string = 'name';
  sortDirection: string = 'asc';
  allowedSortFields: string[] = ['name', 'age', 'revenue'];
  searchCIN: string = '';
  searchResults: any | null = null;

  constructor(
    private personService: PersonService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    // Clear search results when component initializes
    this.searchResults = null;
  }

  ngOnInit(): void {
    this.loadPersons();
  }

  isExpansionDetailRow = (index: number, row: any) => row.hasOwnProperty('detailRow');

  getDataWithDetailRows(data: any[]) {
    return data.reduce((acc, item) => {
      acc.push(item);
      acc.push({ detailRow: true, idGarantie: item.idGarantie, documents: item.documents });
      return acc;
    }, []);
  }

  loadPersons(): void {
    this.personService.getPaginatedPersons(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response) => {
        this.dataSource = this.getDataWithDetailRows(response.content);
        this.totalItems = response.totalElements;
      },
      error: (error) => {
        this.snackBar.open('Error loading persons: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPersons();
  }

  onSortChange(event: any): void {
    if (this.allowedSortFields.includes(event.active)) {
      this.sortField = event.active;
      this.sortDirection = event.direction;
      this.loadPersons();
    } else {
      this.snackBar.open('Sorting is only allowed on Name, Age, or Revenue fields', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    }
  }

  deactivatePerson(id: number): void {
    if (confirm('Are you sure you want to deactivate this person? This action cannot be undone.')) {
      this.personService.deactivatePerson(id).subscribe({
        next: () => {
          this.snackBar.open('Person deactivated successfully', 'Close', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
          this.loadPersons();
        },
        error: (error) => {
          this.snackBar.open('Error deactivating person: ' + error.message, 'Close', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
    }
  }

  deletePerson(id: number): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.personService.deletePerson(id).subscribe({
        next: () => {
          this.snackBar.open('Person deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
          this.loadPersons();
        },
        error: (error) => {
          this.snackBar.open('Error deleting person: ' + error.message, 'Close', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
    }
  }

  searchPerson(): void {
    if (this.searchCIN.trim()) {
      this.personService.searchPersonByCIN(this.searchCIN).subscribe({
        next: (persons) => {
          if (persons.length > 0) {
            this.searchResults = persons;
            this.snackBar.open(`Found ${persons.length} person${persons.length > 1 ? 's' : ''}`, 'Close', {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-primary']
            });
          } else {
            this.searchResults = null;
            this.snackBar.open('No persons found with this CIN', 'Close', {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        },
        error: (error) => {
          this.searchResults = null;
          const errorMessage = error.error?.message || 'Error searching for person';
          this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-error']
          });
          console.error('Search error:', error);
        }
      });
    } else {
      this.snackBar.open('Please enter a CIN number', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    }
  }

  navigateToAddPerson(): void {
    this.router.navigate(['/person']);
  }

  openAddFormWithPerson(person: Person): void {
    this.router.navigate(['../add'], {
      relativeTo: this.route,
      state: { person: person, mode: 'edit' }
    });
  }

  openEditDialog(element: any): void {
    const dialogRef = this.dialog.open(PersonComponent, {
      width: '500px',
      data: { 
        mode: 'edit',
        person: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPersons();
      }
    });
  }

  navigateToPerson(id: number): void {
    this.router.navigate(['../person', id], { relativeTo: this.route });
  }

  togglePdf(person: any): void {
    this.expandedPersonId = this.expandedPersonId === person.idGarantie ? null : person.idGarantie;
    console.log('Toggled PDF for:', person, 'expandedPersonId:', this.expandedPersonId);
  }

  getPdfUrl(person: any): SafeResourceUrl {
    const url = `http://localhost:8088/api/v1/person/${person.idGarantie}/document`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  }
