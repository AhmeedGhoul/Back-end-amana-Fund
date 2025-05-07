import { Component, Input, OnInit } from '@angular/core';
import { FraudCase } from './fraud-case.model';
import { FraudCaseService } from './fraud-case.service';
import { MatDialog } from '@angular/material/dialog';
import { AddFraudCaseDialogComponent } from './add-fraud-case-dialog/add-fraud-case-dialog.component';
import { Audit } from '../audit/audit.model';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../../material.module";

@Component({
  selector: 'app-fraud-case',
  templateUrl: './fraud-case.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    NgForOf,
    MatInputModule,
    MatSelectModule,
    NgIf,
    MaterialModule,
    DatePipe
  ],
  styleUrls: ['./fraud-case.component.css']
})
export class FraudCaseComponent implements OnInit {
  fraudCases: FraudCase[] = [];
  currentPage = 0;
  pageSize = 10;
  totalCases = 0;

  filters = {
    caseType: '',
    caseStatus: '',
    startDate: null as Date | null,
    endDate: null as Date | null
  };

  caseTypes = ['FINANCIAL', 'COMPLIANCE', 'RISK', 'CORRUPTION'];
  caseStatuses = ['PENDING', 'FAILED', 'FINISHED','PAUSED'];
  activeTab = 'preset';
  selectedPreset = '';

  @Input() selectedAudit!: Audit | null;

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
      startDate: this.filters.startDate?.toISOString() || null,
      endDate: this.filters.endDate?.toISOString() || null
    };

    this.fraudCaseService.searchCases(query, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.fraudCases = res.content;
        this.totalCases = res.totalElements;
      },
      error: (err) => console.error('Search failed', err)
    });
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
