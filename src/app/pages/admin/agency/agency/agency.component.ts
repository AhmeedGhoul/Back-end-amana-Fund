import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AgencyService } from './agency.service';
import { Agency } from './agency.model';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddAgencyDialogComponent } from './add-agency-dialog/add-agency-dialog.component';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MaterialModule,
    FormsModule
  ],
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {
  agencies: Agency[] = [];
  pageSize = 10;
  currentPage = 0;
  totalAgencies = 0;

  filters: {
    address: string;
    city: string;
    phoneNumber: string;
    email: string;
    governorate: string;
  } = {
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    governorate: ''
  };

  governorates: string[] = ['TUNIS', 'NABEUL', 'SFAX', 'GABES']; // Ensure this matches your backend enum
  displayedColumns: string[] = ['governorate', 'address', 'city', 'phoneNumber', 'email', 'actions'];

  constructor(private agencyService: AgencyService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies(): void {
    this.agencyService.getAllAgencies(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.agencies = res.content;
        this.totalAgencies = res.totalElements;
      },
      error: (err) => console.error('Error loading agencies:', err)
    });
  }

  pageChanged(newPage: number): void {
    this.currentPage = newPage;
    this.loadAgencies();
  }

  applyFilters(): void {
    const query = {
      address: this.filters.address,
      city: this.filters.city,
      phoneNumber: this.filters.phoneNumber,
      email: this.filters.email,
      governorate: this.filters.governorate
    };

    this.agencyService.searchAgencies(query, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.agencies = res.content;
        this.totalAgencies = res.totalElements;
      },
      error: (err) => console.error('Search failed:', err)
    });
  }

  openAddAgencyDialog(): void {
    const dialogRef = this.dialog.open(AddAgencyDialogComponent, {
      width: '600px', // Adjust width as needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAgencies();
      }
    });
  }

  editAgency(agency: Agency): void {
    const dialogRef = this.dialog.open(AddAgencyDialogComponent, {
      width: '600px', // Adjust width as needed
      data: { agency: agency }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAgencies();
      }
    });
  }

  deleteAgency(agency: Agency): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.agencyService.deleteAgency(agency).subscribe(() => this.loadAgencies());
    }
  }

  generateReport(): void {
    this.agencyService.generateAgencyReport().subscribe(() => alert('Agency report generated successfully!'));
  }

  @Output() selectionChanged = new EventEmitter<Agency>();
  selectedAgency: Agency | null = null;

  selectAgency(agency: Agency) {
    this.selectionChanged.emit(agency);  // Emits selected agency
  }
  onAgencySelectionChanged(agency: Agency) {
    this.selectedAgency = agency;
  }

  onRequestSelectionChanged(request: any) {
    console.log('Selected request:', request);
  }
}
