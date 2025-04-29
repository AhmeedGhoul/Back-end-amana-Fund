import {Component, Input, OnInit} from '@angular/core';
import { FraudCase } from './fraud-case.model';
import { FraudCaseService } from './fraud-case.service';
import { MatDialog } from '@angular/material/dialog';
import { AddFraudCaseDialogComponent } from './add-fraud-case-dialog/add-fraud-case-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material.module';
import {Audit} from "../audit/audit.model";

@Component({
  selector: 'app-fraud-case',
  standalone: true,
  templateUrl: './fraud-case.component.html',
  styleUrls: ['./fraud-case.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MaterialModule
  ]
})
export class FraudCaseComponent implements OnInit {
  fraudCases: FraudCase[] = [];
  filters = {
    caseType: '',
    caseStatus: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  };
  currentPage = 0;
  pageSize = 10;
  totalCases = 0;

  @Input() selectedAudit!: Audit | null;

  onAuditSelectionChanged(audit: Audit) {
    this.selectedAudit = audit;
  }
  constructor(private fraudCaseService: FraudCaseService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.fraudCaseService.getAllCases(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.fraudCases = res.content;
        this.totalCases = res.totalElements;
      },
      error: (err) => console.error('Error loading fraud cases', err)
    });
  }

  applyFilters(): void {
    const query = {
      caseType: this.filters.caseType,
      caseStatus: this.filters.caseStatus,
      detectionDateTime: this.filters.startDate?.toISOString() || null
    };

    this.fraudCaseService.searchCases(query, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.fraudCases = res.content;
        this.totalCases = res.totalElements;
      },
      error: (err) => console.error('Search failed', err)
    });
  }

  pageChanged(newPage: number): void {
    this.currentPage = newPage;
    this.loadCases();
  }

  openAddFraudCaseDialog(): void {
    const dialogRef = this.dialog.open(AddFraudCaseDialogComponent, {
      width: '600px',
      data: { selectedAudit: this.selectedAudit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCases();
      }
    });
  }

  editFraudCase(fraudCase: FraudCase): void {
    const dialogRef = this.dialog.open(AddFraudCaseDialogComponent, {
      width: '600px',
      data: { fraudCase }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCases();
      }
    });
  }

  deleteFraudCase(fraudCase: FraudCase): void {
    if (confirm('Are you sure you want to delete this fraud case?')) {
      this.fraudCaseService.deleteCase(fraudCase).subscribe(() => {
        this.loadCases();
      });
    }
  }

  generateReport(): void {
    this.fraudCaseService.generateReport().subscribe(() => {
      alert('Fraud case report generated successfully!');
    });
  }
}
