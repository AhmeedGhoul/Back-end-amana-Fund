import { Component, OnInit } from '@angular/core';
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
    MatButtonModule
  ],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'lastName', 'cin', 'email', 'age', 'revenue', 'active', 'documents', 'actions'];
  dataSource: any[] = [];
  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  sortField: string = 'name';
  sortDirection: string = 'asc';

  constructor(
    private personService: PersonService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getPaginatedPersons(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response) => {
        this.dataSource = response.content;
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
    this.sortField = event.active;
    this.sortDirection = event.direction;
    this.loadPersons();
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

  navigateToAddPerson(): void {
    this.router.navigate(['/person']);
  }

  navigateToPerson(id: number): void {
    this.router.navigate(['../person', id], { relativeTo: this.route });
  }
}
