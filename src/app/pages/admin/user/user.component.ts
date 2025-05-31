import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './user.model';
import { UserService } from './user.service';
import { PromotionDialogComponent } from './promotion-dialog/promotion-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

// Angular Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatPaginatorModule,
    PromotionDialogComponent,
    ConfirmationDialogComponent
  ]
})
export class UserComponent implements OnInit {
  users: User[] = [];
  totalUsers = 0;
  currentPage = 0;
  pageSize = 10;
  searchQuery = '';
  ageFilter: number | null = null;
  enabledFilter: boolean | null = null;
  isLoading = false;
  selectedUser: User | null = null;
  
  // Table columns
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];

  constructor(
    private userService: UserService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.content.filter(user => !user.accountDeleted);
        this.totalUsers = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
        this.showError('Failed to load users');
      }
    });
  }

  applyFilters(): void {
    this.isLoading = true;
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Auth token not found');
      this.isLoading = false;
      return;
    }
    
    const filters = {
      firstName: this.searchQuery,
      lastName: this.searchQuery,
      email: this.searchQuery,
      age: this.ageFilter,
      enabled: this.enabledFilter
    };
    
    this.userService.searchUsers(filters, this.currentPage, this.pageSize, token).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalUsers = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error applying filters:', err);
        this.isLoading = false;
        this.showError('Failed to apply filters');
      }
    });
  }

  generateReport(): void {
    const loadingRef = this.snackBar.open('Generating report...', undefined, {
      duration: 0
    });
    
    this.userService.generateUserReport().subscribe({
      next: (response: any) => {
        loadingRef.dismiss();
        this.showSuccess('Report generated successfully');
        // Create a blob from the response and trigger download
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        loadingRef.dismiss();
        console.error('Error generating report:', err);
        this.showError('Failed to generate report');
      }
    });
  }

  getUserInitialsColor(user: User): string {
    const colors = [
      '#3B82F6', // blue-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#14B8A6', // teal-500
      '#F97316', // orange-500
      '#6366F1'  // indigo-500
    ];
    
    // Simple hash function to get consistent colors for the same user
    const str = user.firstName + user.lastName;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  openPromotionPanel(user: User): void {
    const dialogRef = this.dialog.open(PromotionDialogComponent, {
      width: '500px',
      data: { user },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        if (result.action === 'promote') {
          this.promoteUser(user, result.role);
        } else if (result.action === 'demote') {
          this.demoteUser(user, result.role);
        }
      }
    });
  }

  promoteUser(user: User, role: string): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Auth token not found');
      this.isLoading = false;
      return;
    }

    this.userService.promoteUser(user.email, role, token).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('User role updated successfully');
      },
      error: err => {
        console.error('Promotion failed:', err);
        this.isLoading = false;
        this.showError('Failed to update user role');
      }
    });
  }

  demoteUser(user: User, role: string): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Auth token not found');
      this.isLoading = false;
      return;
    }

    this.userService.demoteUser(user.email, role, token).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('User role updated successfully');
      },
      error: err => {
        console.error('Demotion failed:', err);
        this.isLoading = false;
        this.showError('Failed to update user role');
      }
    });
  }

  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        
        // Show loading indicator
        const loadingRef = this.snackBar.open('Deleting user...', undefined, {
          duration: 0
        });

        this.userService.deleteUser(user).subscribe({
          next: () => {
            loadingRef.dismiss();
            this.showSuccess('User deleted successfully');
            // Remove the deleted user from the local array
            this.users = this.users.filter(u => u.id !== user.id);
            this.totalUsers--;
            
            // If we're on a page that no longer exists, go back one page
            if (this.currentPage > 0 && this.currentPage >= this.getTotalPages()) {
              this.currentPage--;
            }
            
            // Reload users to refresh the list
            this.loadUsers();
          },
          error: (err) => {
            loadingRef.dismiss();
            console.error('Error deleting user:', err);
            this.isLoading = false;
            this.showError(err.error?.message || 'Failed to delete user');
          }
        });
      }
    });
  }

  toggleUserStatus(user: User): void {
    if (!user) {
      this.showError('No user selected');
      return;
    }

    const newStatus = !user.enabled;
    const action = newStatus ? 'activate' : 'deactivate';
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: `Confirm ${action} user`,
        message: `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancel',
        confirmColor: newStatus ? 'primary' : 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        const loadingRef = this.snackBar.open(`${action.charAt(0).toUpperCase() + action.slice(1)}ing user...`, undefined, {
          duration: 0
        });

        this.userService.toggleUserStatus(user.id, newStatus).subscribe({
          next: () => {
            loadingRef.dismiss();
            this.showSuccess(`User ${action}d successfully`);
            // Update the local user object
            user.enabled = newStatus;
            this.loadUsers();
          },
          error: (err) => {
            loadingRef.dismiss();
            console.error(`Error ${action}ing user:`, err);
            this.isLoading = false;
            this.showError(err.error?.message || `Failed to ${action} user`);
          }
        });
      }
    });
  }

  openAddUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '600px',
      data: user ? { user } : null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.showSuccess(`User ${user ? 'updated' : 'created'} successfully`);
      }
    });
  }

  editUser(user: User): void {
    this.openAddUserDialog(user);
  }

  // Handle page change events from mat-paginator
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.ageFilter = null;
    this.enabledFilter = null;
    this.currentPage = 0;
    this.loadUsers();
  }

  selectUser(user: User | null): void {
    this.selectedUser = user === this.selectedUser ? null : user;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize) || 1;
  }
}
