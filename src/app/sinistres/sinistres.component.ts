// sinistres.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Sinistres } from '../sinistres.model';
import { SinistresService } from '../sinistres.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-sinistres',
  templateUrl: './sinistres.component.html',
  styleUrls: ['./sinistres.component.scss']
})
export class SinistresComponent implements OnInit, AfterViewInit, OnDestroy {

  sinistresList: Sinistres[] = [];
  selectedSinistre: Sinistres | null = null;
  sinistreForm: FormGroup;
  showForm: boolean = false;

  page: number = 0;
  size: number = 5;
  totalElements: number = 0;

  searchClaimAmount: number | null = null;
  searchSettlementDate: string = '';

  userId: number | null = null;

  sinistreId: number | null = null;
  indemnisationAmount: number | null = null;
  errorMessage: string = '';

  public chart: any;

  @ViewChild('myChart') myChartRef!: ElementRef;

  constructor(
    private sinistresService: SinistresService,
    private fb: FormBuilder
  ) {
    this.sinistreForm = this.fb.group({
      claimAmount: [5000.0, [Validators.required, Validators.min(0)]],
      reinsuranceShaire: [0.3, [Validators.required, Validators.min(0), Validators.max(1)]],
      settlementDate: [new Date(), [Validators.required]],
      settlementAmount: [4500.0, [Validators.required, Validators.min(0)]],
      user: [null],
      police: [null]
    });
  }

  ngOnInit(): void {
    this.loadSinistres();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadSinistres(): void {
    this.sinistresService.getSinistres(this.page, this.size, this.searchClaimAmount, this.searchSettlementDate).subscribe(
      (data: any) => {
        this.sinistresList = data.content;
        this.totalElements = data.totalElements;
      },
      (error: any) => {
        console.error('Error fetching sinistres:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.sinistreForm.invalid) {
      return;
    }

    const formValue = this.sinistreForm.value;
    const formattedSettlementDate = new Date(formValue.settlementDate).toISOString();

    const newSinistre = new Sinistres(
      null,
      formValue.claimAmount,
      formValue.reinsuranceShaire,
      formattedSettlementDate,
      formValue.settlementAmount,
      formValue.user ? formValue.user : null,
      formValue.police
    );

    if (this.selectedSinistre) {
      newSinistre.idSinistre = this.selectedSinistre.idSinistre;
      if (newSinistre.idSinistre !== null) {
        this.sinistresService.updateSinistre(newSinistre.idSinistre, newSinistre).subscribe(
          (updatedSinistre) => {
            const index = this.sinistresList.findIndex(s => s.idSinistre === updatedSinistre.idSinistre);
            if (index !== -1) {
              this.sinistresList[index] = updatedSinistre;
            }
            this.selectedSinistre = null;
            this.showForm = false;
          },
          (error) => {
            console.error('Error updating sinistre:', error);
          }
        );
      } else {
        console.error('ID is null, cannot update.');
      }
    } else {
      this.sinistresService.addSinistre(newSinistre).subscribe(
        (addedSinistre) => {
          this.sinistresList.push(addedSinistre);
          this.sinistreForm.reset();
          this.showForm = false;
        },
        (error) => {
          console.error('Error adding sinistre:', error);
        }
      );
    }
  }

  showAddSinistreForm() {
    this.showForm = true;
    this.selectedSinistre = null;
  }

  cancelAddSinistre() {
    this.showForm = false;
  }

  selectSinistre(sinistre: Sinistres): void {
    this.selectedSinistre = sinistre;
    this.sinistreForm.patchValue({
      claimAmount: sinistre.claimAmount,
      reinsuranceShaire: sinistre.reinsuranceShaire,
      settlementDate: new Date(sinistre.settlementDate).toISOString().split('T')[0],
      settlementAmount: sinistre.settlementAmount,
      user: sinistre.user || null,
      police: [null]
    });
    this.showForm = true;
  }

  deselectSinistre(): void {
    this.selectedSinistre = null;
    this.showForm = false;
  }

  deleteSinistre(id: number | null): void {
    if (id !== null) {
      this.sinistresService.deleteSinistre(id).subscribe(
        () => {
          this.sinistresList = this.sinistresList.filter((sinistre) => sinistre.idSinistre !== id);
          this.selectedSinistre = null;
        },
        (error) => {
          console.error('Error deleting sinistre:', error);
        }
      );
    }
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadSinistres();
  }

  searchSinistres(): void {
    this.page = 0;
    this.size = 5;
    this.loadSinistres();
  }

  clearSearch(): void {
    this.searchClaimAmount = null;
    this.searchSettlementDate = '';
    this.page = 0;
    this.loadSinistres();
  }

  downloadPdf(id: number | null): void {
    if (id !== null) {
      this.sinistresService.getSinistrePdf(id).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          saveAs(blob, `sinistre_${id}.pdf`);
        },
        (error) => {
          console.error('Error downloading PDF:', error);
        }
      );
    }
  }

  downloadExcelForUser(): void {
    if (this.userId) {
      this.sinistresService.getSinistresExcelForUserById(this.userId).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, `sinistres_user_${this.userId}.xlsx`);
          this.userId = null;
        },
        (error) => {
          console.error('Error downloading Excel:', error);
          const reader = new FileReader();
          reader.onload = () => {
            console.error('Backend error:', reader.result);
          };
          reader.onerror = () => {
            console.error('Error reading error Blob');
          };
          reader.readAsText(error.error);
        }
      );
    } else {
      alert('Please enter a User ID.');
    }
  }

  calculateIndemnification(): void {
    if (this.sinistreId === null) {
      this.errorMessage = 'Please enter a Sinistre ID.';
      this.indemnisationAmount = null;
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      return;
    }

    this.sinistresService.getIndemnisationFinale(this.sinistreId).subscribe(
      (amount: number) => {
        this.indemnisationAmount = amount;
        this.errorMessage = '';
        this.createChart(amount);
      },
      (error) => {
        console.error('Error calculating indemnification:', error);
        this.errorMessage = 'Error calculating indemnification. Please check the Sinistre ID.';
        this.indemnisationAmount = null;
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
      }
    );
  }

  createChart(amount: number) {
    if (this.chart) {
      this.chart.destroy();
    }

    const claimAmount = this.sinistreForm.get('claimAmount')?.value;

    this.chart = new Chart(this.myChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Indemnisation Amount'],
        datasets: [{
          label: 'Amount (EUR)',
          data: [amount],
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Claim Amount (EUR)',
          data: [claimAmount],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
