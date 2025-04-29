import { Component, OnInit } from '@angular/core';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog } from './activity-log.model';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material.module';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MaterialModule
  ],
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  activityLogs: ActivityLog[] = [];
  filters = {
    activityName: '',
    activityDescription: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  currentPage = 0;
  pageSize = 10;
  totalLogs = 0;

  constructor(private activityLogService: ActivityLogService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadLogs();
  }
  selectedLogs: ActivityLog[] = [];

  isSelected(log: ActivityLog): boolean {
    return this.selectedLogs.includes(log);
  }

  @Output() selectionChanged = new EventEmitter<ActivityLog[]>();

  toggleSelection(log: ActivityLog): void {
    if (this.isSelected(log)) {
      this.selectedLogs = this.selectedLogs.filter(l => l !== log);
    } else {
      this.selectedLogs.push(log);
    }
    this.selectionChanged.emit(this.selectedLogs); // 🔥 emit updated list
  }

  isAllSelected(): boolean {
    return this.selectedLogs.length === this.activityLogs.length;
  }

  someSelected(): boolean {
    return this.selectedLogs.length > 0 && !this.isAllSelected();
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedLogs = [];
    } else {
      this.selectedLogs = [...this.activityLogs];
    }
  }
  loadLogs(): void {
    this.activityLogService.getAllLogs(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.activityLogs = res.content;
        this.totalLogs = res.totalElements;
      },
      error: (err) => console.error('Error loading logs', err)
    });
  }

  pageChanged(newPage: number): void {
    this.currentPage = newPage;
    this.loadLogs();
  }

  applyFilters(): void {
    const query = {
      activityName: this.filters.activityName,
      activityDescription: this.filters.activityDescription,
      activityDate: this.filters.startDate?.toISOString() || null,
      reviewedDate: this.filters.endDate?.toISOString() || null,
    };

    this.activityLogService.searchLogs(query, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.activityLogs = res.content;
        this.totalLogs = res.totalElements;
      },
      error: (err) => console.error('Search failed', err)
    });
  }

  generateReport(): void {
    this.activityLogService.generateReport().subscribe(() => {
      alert('Report generated successfully!');
    });
  }
}
