import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rib-help-dialog',
  template: `
    <h2 mat-dialog-title>RIB Validation Help</h2>
    <mat-dialog-content>
      <p>Having trouble with your Relevé d'Identité Bancaire (RIB)?</p>
      <ul>
        <li>Ensure the RIB number is exactly 23 characters long</li>
        <li>Check for any typos or spaces in the RIB</li>
        <li>Verify the RIB matches the bank account details</li>
      </ul>
      <p>If you continue to experience issues, please contact our support team.</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onClose()">Close</button>
      <button mat-raised-button color="primary" (click)="contactSupport()">Contact Support</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-content {
      text-align: left;
    }
    ul {
      margin-bottom: 15px;
    }
  `]
})
export class RIBHelpDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RIBHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ribError: boolean }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  contactSupport(): void {
    // Implement support contact logic
    window.open('mailto:support@example.com?subject=RIB Validation Help', '_blank');
    this.dialogRef.close();
  }
}
