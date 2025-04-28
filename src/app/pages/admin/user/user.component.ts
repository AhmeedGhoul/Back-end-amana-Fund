import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from './user.model';
import { UserService } from './user.service';
import { PromotionDialogComponent } from './promotion-dialog/promotion-dialog.component';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";

import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {AddUserDialogComponent} from "./add-user-dialog/add-user-dialog.component";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatCardTitle,
    MatIcon,
    MatButton,
    MatIconButton,
    FormsModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
    MatInput,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow
  ],
  styles: []
})
export class UserComponent implements OnInit {
  users: User[] = [];
  totalUsers = 0;
  currentPage = 0;
  pageSize = 10;
  searchQuery = '';
  ageFilter: number | null = null;
  enabledFilter: boolean | null = null;
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<User>();

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // Filter users to only include those with accountDeleted === false
        this.users = response.content.filter(user => !user.accountDeleted); // Use accountDeleted
        this.totalUsers = response.totalElements;
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  applyFilters(): void {
    const filters = {
      firstName: this.searchQuery,
      lastName: this.searchQuery,
      email: this.searchQuery,
      age: this.ageFilter,
      enabled: this.enabledFilter
    };
    this.userService.searchUsers(filters, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalUsers = response.totalElements;
        this.dataSource.data = this.users;
      },
      error: (err) => console.error('Error applying filters:', err)
    });
  }

  generateReport(): void {
    this.userService.generateUserReport().subscribe({
      next: () => {
        alert('Report generated successfully!');
      },
      error: (err) => console.error('Error generating report:', err)
    });
  }



  pageChanged(newPage: number): void {
    this.currentPage = newPage;
    this.loadUsers();
  }

  openPromotionPanel(user: User): void {
    const dialogRef = this.dialog.open(PromotionDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.role) {
        if (result.action === 'promote') {
          this.promoteUser(user, result.role);
        } else if (result.action === 'demote') {
          this.demoteUser(user, result.role);
        }
      }
    });}

  promoteUser(user: User, role: string): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Auth token not found');
      return;
    }

    this.userService.promoteUser(user.email, role, token).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: err => console.error('Promotion failed:', err)
    });
  }

  demoteUser(user: User, role: string): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Auth token not found');
      return;
    }

    this.userService.demoteUser(user.email, role, token).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: err => console.error('Demotion failed:', err)
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
  }


  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh the users list after adding a new user
      }
    });
  }
  editUser(user: any) {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh your users list after editing
      }
    });
  }
}
