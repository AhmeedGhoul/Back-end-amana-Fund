import {Component, Input, OnInit} from '@angular/core';
import { AuditService } from './audit.service';
import { Audit } from './audit.model';
import { MatDialog } from '@angular/material/dialog';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../../../material.module";
import {FormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import {AddAuditDialogComponent} from "./add-audit-dialog/add-audit-dialog.component";
import {ActivityLog} from "../activity-log/activity-log.model";

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MaterialModule,
    FormsModule
  ],
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  audits: Audit[] = [];
  pageSize = 10;
  currentPage = 0;
  totalAudits = 0;

  filters: {
    output: string;
    auditType: string;
    statusAudit: string;
    startDate: Date | null;
    endDate: Date | null;
  } = {
    output: '',
    auditType: '',
    statusAudit: '',
    startDate: null,
    endDate: null
  };

  @Input() selectedLogs: ActivityLog[] = [];

  auditTypes = ['RISK', 'COMPLIANCE', 'FINANCIAL'];
  statuses = ['PENDING', 'FAILED', 'FINISHED', 'PAUSED'];
  activeTab = 'preset';
  selectedPreset = '';

  displayedColumns: string[] = ['dateAudit', 'statusAudit', 'output', 'reviewedDate', 'auditType', 'actions'];

  constructor(private auditService: AuditService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAudits();
  }

  loadAudits(): void {
    this.auditService.getAllAudits(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.audits = res.content;
        this.totalAudits = res.totalElements;
      },
      error: (err) => console.error('Error loading audits:', err)
    });
  }

  pageChanged(newPage: number): void {
    this.currentPage = newPage;
    this.loadAudits();
  }

  applyPresetRange(): void {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (this.selectedPreset) {
      case 'last7':
        start = new Date();
        start.setDate(today.getDate() - 7);
        end = today;
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = today;
        end = today;
    }

    this.filters.startDate = start;
    this.filters.endDate = end;
    this.applyFilters();
  }

  applyFilters(): void {
    const query = {
      output: this.filters.output,
      auditType: this.filters.auditType,
      statusAudit: this.filters.statusAudit,
      startDate: this.filters.startDate?.toISOString() ?? null,
      endDate: this.filters.endDate?.toISOString() ?? null
    };

    this.auditService.searchAudits(query, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.audits = res.content;
        this.totalAudits = res.totalElements;
      },
      error: (err) => console.error('Search failed:', err)
    });
  }


  openAddAuditDialog(): void {
    const dialogRef = this.dialog.open(AddAuditDialogComponent, {
      width: '700px',
      data: { selectedActivities: this.selectedLogs } // ✅ PASS selected activities here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAudits();
      }
    });
  }

  editAudit(audit: Audit): void {
    const dialogRef = this.dialog.open(AddAuditDialogComponent, {
      width: '700px',
      data: { audit: audit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAudits();
      }
    });
  }

  deleteAudit(audit: Audit): void {
    if (confirm('Are you sure you want to delete this audit?')) {
      this.auditService.deleteAudit(audit).subscribe(() => this.loadAudits());
    }
  }

  generateReport(): void {
    this.auditService.generateAuditReport().subscribe(() => alert('Audit report generated successfully!'));
  }
}
