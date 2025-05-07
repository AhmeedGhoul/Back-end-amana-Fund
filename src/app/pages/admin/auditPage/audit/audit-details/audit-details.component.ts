import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuditService } from "../audit.service";
import { MatCardModule } from "@angular/material/card";
import { MaterialModule } from "../../../../../material.module";
import { DatePipe, NgIf } from "@angular/common";
import { FraudCaseService } from '../../../auditPage/fraud-case/fraud-case.service';
import {CaseType, FraudCase} from '../../../auditPage/fraud-case/fraud-case.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-audit-details',
  templateUrl: './audit-details.component.html',
  imports: [
    MatCardModule,
    MaterialModule,
    NgIf,
    DatePipe
  ],
  standalone: true
})
export class AuditDetailsComponent {
  analysisResult: string | null = null;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AuditDetailsComponent>,
    private http: HttpClient,
    private auditService: AuditService,
    private fraudCaseService: FraudCaseService,
    private snackBar: MatSnackBar
  ) {}

  runDetection(): void {
    this.loading = true;
    this.auditService.detectSuspiciousActivity(this.data.audit.idAudit).subscribe({
      next: (result: string) => {
        this.analysisResult = result;
        this.loading = false;
      },
      error: () => {
        this.analysisResult = 'Failed to analyze suspicious activity.';
        this.loading = false;
      }
    });
  }

  createFraudCase(): void {
    const fraudCase: FraudCase = {
      caseType: CaseType.RISK, // or CaseType.RISK, etc.
      detectionDateTime: new Date().toISOString(),
      caseStatus: 'PENDING',
      audit: this.data.audit
    };

    this.fraudCaseService.createCase(fraudCase).subscribe({
      next: () => {
        this.snackBar.open('Fraud case created successfully.', 'OK', { duration: 3000 });
        this.dialogRef.close();
      },
      error: () => {
        this.snackBar.open('Failed to create fraud case.', 'Dismiss', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
