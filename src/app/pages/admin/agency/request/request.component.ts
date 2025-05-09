import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { RequestService } from './request.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product, Request } from './request.model';
import { AddRequestDialogComponent } from './add-request-dialog/add-request-dialog.component';
import { Agency } from "../agency/agency.model";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { MaterialModule } from "@app/material.module";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    DatePipe,
  ],
  providers: [DatePipe],
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  requests: Request[] = [];
  pageSize = 10;
  currentPage = 0;
  totalRequests = 0;
  productLabels = {
    [Product.JAM3EYA]: 'JAM3EYA',
    [Product.EPARGNE]: 'EPARGNE',
    [Product.EPARGNE_ZEKET]: 'EPARGNE ZEKET'
  };
  productEnum = Object.values(Product);

  filters = {
    product: null as Product | null,
  };

  displayedColumns: string[] = ['product', 'document', 'dateRequest', 'actions'];

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  @Input() selectedAgency: Agency | null = null;

  ngOnInit(): void {
    this.loadRequests();
  }

  getProductLabel(product: Product): string {
    return this.productLabels[product] || product;
  }

  pageChanged(newPage: number): void {
    this.currentPage = newPage;
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getAllRequests(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.requests = res.content; // Directly set the data from the response
        this.totalRequests = res.totalElements;
      },
      error: (err) => console.error('Error loading requests', err)
    });
  }

  applyFilters(): void {
    const query = {
      product: this.filters.product
    };

    this.requestService.searchRequests(query, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.requests = res.content;
        this.totalRequests = res.totalElements;
      },
      error: (err) => console.error('Search failed', err)
    });
  }

  openAddRequestDialog(): void {
    const dialogRef = this.dialog.open(AddRequestDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  editRequest(request: Request): void {
    const dialogRef = this.dialog.open(AddRequestDialogComponent, {
      width: '600px',
      data: { request }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  deleteRequest(request: Request): void {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requestService.deleteRequest(request).subscribe(() => this.loadRequests());
    }
  }

  generateReport(): void {
    this.requestService.generateRequestReport().subscribe(() => {
      this.snackBar.open('Request report generated successfully!', 'Close', { duration: 3000 });
    });
  }

  @Output() requestSelected = new EventEmitter<Request>();

  selectRequest(request: Request) {
    this.requestSelected.emit(request);
  }
}
