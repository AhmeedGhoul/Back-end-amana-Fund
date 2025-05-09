import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FraudCaseService } from '../fraud-case.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Audit } from '../../audit/audit.model';
import { FraudCase } from '../fraud-case.model';
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-add-fraud-case-dialog',
  standalone: true,
  templateUrl: './add-fraud-case-dialog.component.html',
  styleUrls: ['./add-fraud-case-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTableModule
  ]
})
export class AddFraudCaseDialogComponent {
  caseForm: FormGroup;
  isEditMode = false;
  caseTypes = ['FINANCIAL', 'COMPLIANCE', 'RISK', 'CORRUPTION'];
  caseStatuses = ['PENDING', 'FAILED', 'FINISHED','PAUSED'];

  selectedAuditToDisplay: Audit | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddFraudCaseDialogComponent>,
    private fraudCaseService: FraudCaseService,
    @Inject(MAT_DIALOG_DATA) public data: { fraudCase?: FraudCase; selectedAudit?: Audit }
  ) {
    this.caseForm = this.fb.group({
      id_Fraud: [null],
      caseType: ['', Validators.required],
      detectionDateTime: ['', Validators.required],
      caseStatus: ['', Validators.required]
    });

    if (data?.fraudCase) {
      this.isEditMode = true;
      this.caseForm.patchValue(data.fraudCase);

      // ✅ During Edit: get fraudCase.audit to display
      if (data.fraudCase.audit) {
        this.selectedAuditToDisplay = data.fraudCase.audit;
      }
    } else {
      // ✅ During Add: show selected audit
      this.selectedAuditToDisplay = data?.selectedAudit || null;
    }
  }
  submit(): void {
    if (this.caseForm.invalid) return;

    const payload: FraudCase = {
      ...this.caseForm.value,
      audit: this.data.selectedAudit ? { idAudit: this.data.selectedAudit.idAudit } : undefined
    };

    if (this.isEditMode) {
      this.fraudCaseService.updateCase(payload).subscribe(() => this.dialogRef.close(true));
    } else {
      this.fraudCaseService.createCase(payload).subscribe(() => this.dialogRef.close(true));
    }
  }


  close(): void {
    this.dialogRef.close(false);
  }
}
