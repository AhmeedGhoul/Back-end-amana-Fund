import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Account } from '@app/models/account.model';

@Component({
  selector: 'app-accounts-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    NgIf
  ],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss']
})
export class AccountsTableComponent implements AfterViewInit, OnChanges {
  @Input() dataSource: MatTableDataSource<Account> = new MatTableDataSource<Account>([]);
  @Input() displayedColumns: string[] = [];
  @Input() ribError: boolean = false;
  @Input() ribErrorMessage: string = '';
  @Input() totalElements: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() paginator!: MatPaginator;
  @Input() sort!: MatSort;

  @Output() openAccountDetails = new EventEmitter<Account>();
  @Output() resetSearch = new EventEmitter<void>();

  ngAfterViewInit() {
    // Set sort and paginator after view init
    this.assignSortAndPaginator();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-assign if inputs change after init
    this.assignSortAndPaginator();
  }

  private assignSortAndPaginator() {
    if (this.dataSource) {
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  onOpenAccountDetails(account: Account) {
    this.openAccountDetails.emit(account);
  }

  onResetSearch() {
    this.resetSearch.emit();
  }
}
