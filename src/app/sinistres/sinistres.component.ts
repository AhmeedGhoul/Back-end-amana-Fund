import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Sinistres } from '../sinistres.model';
import { SinistresService } from '../sinistres.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Chart,registerables } from 'chart.js';
import { UserService } from '../pages/admin/user/user.service';
@Component({
  selector: 'app-sinistres',
  templateUrl: './sinistres.component.html',
  styleUrls: ['./sinistres.component.scss']
})
export class SinistresComponent implements OnInit, AfterViewInit, OnDestroy {
  public chart: Chart | undefined; // Make sure chart is optionally defined
  sinistresList: Sinistres[] = [];
  selectedSinistre: Sinistres | null = null;
  sinistreForm: FormGroup;
  showForm: boolean = false;
  usersList: any[] = [];
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  showChartModal: boolean = false;

  searchClaimAmount: number | null = null;
  searchSettlementDate: string = '';

  userId: number | null = null;

  sinistreId: number | null = null;
  indemnisationAmount: number | null = null;
  errorMessage: string = '';
  fondsDeReserve: number | null = null;
  risqueMessage: string = '';


  @ViewChild('myChart') myChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private sinistresService: SinistresService, private fb: FormBuilder) {
    this.sinistreForm = this.fb.group({
      claimAmount: [0, [Validators.required]],
      reinsuranceShaire: [0.3, [Validators.required, Validators.min(0), Validators.max(1)]],
      settlementDate: [new Date(), [Validators.required]],
      settlementAmount: [4500.0, [Validators.required, Validators.min(0)]],
      user: [null],
      police: [null]
    });
  }


  ngOnInit(): void {
    this.loadSinistres();

      this.createChart(); // Ensure this is called

  }

  ngAfterViewInit() {  this.createChart(); }

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

  loadSinistresByUserId(): void {
    if (this.userId) {
      this.sinistresService.getSinistresByUserId(this.userId).subscribe(
        (data: Sinistres[]) => {
          this.sinistresList = data;
          this.totalElements = data.length; // Adjust if implementing pagination
        },
        (error) => {
          console.error('Error fetching sinistres for user:', error);
        }
      );
    }
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
    this.sinistreForm.reset();
  }

 cancelAddSinistre(): void {
  this.showForm = false; // Hide the form
  this.selectedSinistre = null; // Deselect any selected sinistre
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
  fetchFondsDeReserve(): void {
    this.sinistresService.getFondsDeReserve().subscribe(
      (fonds) => {
        this.fondsDeReserve = fonds;
      },
      (error) => {
        console.error('Error fetching fonds de reserve:', error);
      }
    );
  }

  evaluateRisk(): void {
    if (this.userId !== null) {
      this.sinistresService.evaluerRisque(this.userId).subscribe(
        (message: string) => {
          this.risqueMessage = message; // Store the risk message
          this.updateChart(); // Update the chart based on the risk evaluation
        },
        (error) => {
          console.error('Error evaluating risk:', error);
          this.risqueMessage = 'Erreur lors de l\'évaluation du risque'; // Set a fallback error message
        }
      );
    }
  }

  createChart(): void {
    const ctx = this.myChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context.');
      return; // Exit if context is null
    }

    // Register necessary components in Chart.js
    Chart.register(...registerables);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Risque faible', 'Risque moyen', 'Risque élevé'],
        datasets: [{
          label: 'Niveau de risque',
          data: [0, 0, 0],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
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

  updateChart(): void {
    if (this.chart) {
      // Reset data to zero before incrementing
      this.chart.data.datasets[0].data = [0, 0, 0]; // Reset to ensure a clean state

      // Use type assertion to ensure data is treated as an array of numbers
      const data = this.chart.data.datasets[0].data as number[];

      // Increment based on the risk message
      if (this.risqueMessage.includes('faible')) {
        data[0] = (data[0] ?? 0) + 1; // Increment low risk
      } else if (this.risqueMessage.includes('moyen')) {
        data[1] = (data[1] ?? 0) + 1; // Increment medium risk
      } else if (this.risqueMessage.includes('élevé')) {
        data[2] = (data[2] ?? 0) + 1; // Increment high risk
      }

      this.chart.update(); // Refresh the chart
    } else {
      console.error('Chart is not initialized'); // Log if chart is not created
    }
  }

  }

