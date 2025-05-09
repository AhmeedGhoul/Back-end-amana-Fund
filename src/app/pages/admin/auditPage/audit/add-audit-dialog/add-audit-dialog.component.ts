import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuditService } from '../audit.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {ActivityLog} from "../../activity-log/activity-log.model";
import {Audit} from "../audit.model";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-add-audit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  templateUrl: './add-audit-dialog.component.html',
  styleUrls: ['./add-audit-dialog.component.css']
})
export class AddAuditDialogComponent implements OnInit {
  auditForm: FormGroup;
  isEditMode = false;

  auditStatusOptions = ['PENDING', 'FAILED', 'FINISHED', 'PAUSED'];
  auditTypeOptions = ['RISK', 'COMPLIANCE', 'FINANCIAL'];
  selectedActivities: ActivityLog[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAuditDialogComponent>,
    private auditService: AuditService,
    @Inject(MAT_DIALOG_DATA) public data: { audit?: Audit, selectedActivities?: ActivityLog[] }
  ) {
    this.auditForm = this.fb.group({
      idAudit: [null],
      dateAudit: ['', Validators.required],
      statusAudit: ['', Validators.required],
      output: ['', Validators.required],
      reviewedDate: [''],
      auditType: ['', Validators.required]
    });

    if (data?.audit) {
      this.isEditMode = true;
      this.patchForm(data.audit);

      if (data.audit.activityLogs && data.audit.activityLogs.length > 0) {
        this.selectedActivities = data.audit.activityLogs;
      } else {
        this.selectedActivities = [];
      }

    } else {
      this.selectedActivities = data?.selectedActivities || [];
    }
  }


  ngOnInit(): void {}

  patchForm(audit: any): void {
    this.auditForm.patchValue({
      idAudit: audit.idAudit,
      dateAudit: audit.dateAudit,
      statusAudit: audit.statusAudit,
      output: audit.output,
      reviewedDate: audit.reviewedDate,
      auditType: audit.auditType
    });
  }
  submit(): void {
    if (this.auditForm.invalid) return;

    const auditPayload = {
      ...this.auditForm.value,
      activityLogs: this.selectedActivities.map(activity => ({ activityId: activity.activityId }))
    };

    if (this.isEditMode) {
      this.auditService.updateAudit(auditPayload).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.auditService.createAudit(auditPayload).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }


  close(): void {
    this.dialogRef.close(false);
  }
}
