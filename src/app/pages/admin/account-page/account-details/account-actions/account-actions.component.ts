import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../../../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './account-actions.component.html',
  styleUrls: ['./account-actions.component.scss']
})
export class AccountActionsComponent {
  @Input() accountId: number | null = null;
  @Input() userId: number | null = null;

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  sendEmail(): void {
    if (!this.accountId || !this.userId) {
      this.snackBar.open('Please select an account first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.accountService.sendAccountEmail(this.accountId, this.userId).subscribe({
      next: () => {
        this.snackBar.open('Email sent successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Failed to send email: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  exportToExcel(): void {
    if (!this.accountId) {
      this.snackBar.open('Please select an account first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.accountService.exportAccountToExcel(this.accountId).subscribe({
      next: (response: Blob) => {
        // Create a blob from the response
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `account_${this.accountId}_details.xlsx`;
        link.click();
        
        this.snackBar.open('Excel file downloaded successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Failed to export to Excel: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
} 