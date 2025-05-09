import { Component, OnInit, ViewChild } from '@angular/core';
import { CreditPoolService } from '../../../services/CreditPool.service';
import { CreditPool } from '@app/models/CreditPool';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-credit-pool',
  templateUrl: './CreditPool.component.html',
  styleUrls: ['./CreditPool.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    RouterModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe
  ]
})
export class CreditPoolComponent implements OnInit {
  // Make Array available in the template
  protected readonly Array = Array;
  // Data properties
  creditPools: CreditPool[] = [];
  newCreditPool: CreditPool = new CreditPool();
  searchId: number | null = null;
  searchResult: CreditPool | null = null;
  isSearching = false;
  searchError: string | null = null;

  // Interest rates properties
  interestRates: Map<number, number> = new Map<number, number>();
  selectedPoolForRates: CreditPool | null = null;
  isLoadingRates = false;
  ratesError: string | null = null;

  // UI state
  showAddForm = false;
  isLoading = false;
  displayedColumns: string[] = ['id', 'poolSum', 'minValue', 'maxValue', 'installments', 'openDate', 'closeDate', 'status', 'actions'];
  isEditing: boolean = false;
  selectedCreditPool: CreditPool | null = null;
  error: string | null = null;
  dataSource: MatTableDataSource<CreditPool> = new MatTableDataSource<CreditPool>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private creditPoolService: CreditPoolService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.loadCreditPools();
  }

  loadCreditPools(): void {
    this.isLoading = true;
    this.creditPoolService.retrieveCreditPools().subscribe({
      next: (creditPools) => {
        // Convert string dates to Date objects for each credit pool
        this.creditPools = creditPools.map(pool => CreditPool.fromJson(pool));

        // Set up the MatTableDataSource
        this.dataSource = new MatTableDataSource(this.creditPools);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Set up custom filtering
        this.dataSource.filterPredicate = (data: CreditPool, filter: string) => {
          const searchTerms = filter.toLowerCase().split(' ');
          const poolData = {
            id: data.id_credit_pool?.toString() || '',
            poolSum: data.pool_Sum?.toString() || '',
            minValue: data.minValue?.toString() || '',
            maxValue: data.maxValue?.toString() || '',
            installments: data.n_Echeance?.toString() || '',
            openDate: this.datePipe.transform(data.open_Date, 'mediumDate') || '',
            closeDate: this.datePipe.transform(data.close_Date, 'mediumDate') || '',
            status: this.getStatusText(data)
          };

          return searchTerms.every(term => {
            return Object.values(poolData).some(val =>
              val.toLowerCase().includes(term)
            );
          });
        };

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading credit pools:', error);
        this.snackBar.open('Failed to load credit pools', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  isValidDate(date: any): boolean {
    return date !== null && date !== undefined && date instanceof Date && !isNaN(date.getTime());
  }
  prepareCreditPoolPayload() {
    // Create payload with exact field names matching the backend entity
    const payload = {
      maxValue: this.newCreditPool.maxValue,
      minValue: this.newCreditPool.minValue,
      n_Echeance: this.newCreditPool.n_Echeance,
      pool_Sum: this.newCreditPool.pool_Sum,
      full: this.newCreditPool.full || false,
      open_Date: this.newCreditPool.open_Date instanceof Date ? this.formatDateForBackend(this.newCreditPool.open_Date) : null,
      close_Date: this.newCreditPool.close_Date instanceof Date ? this.formatDateForBackend(this.newCreditPool.close_Date) : null,
      grace_Period: this.newCreditPool.grace_Period instanceof Date ? this.formatDateForBackend(this.newCreditPool.grace_Period) : null,
      Period: this.newCreditPool.Period instanceof Date ? this.formatDateForBackend(this.newCreditPool.Period) : null
    };

    console.log('Prepared credit pool payload:', payload);
    return payload;
  }

  // Format date to match backend's expected format (yyyy-MM-dd'T'HH:mm:ss)
  formatDateForBackend(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().slice(0, 19);
  }


  createCreditPool(): void {
    if (!this.validateCreditPool(this.newCreditPool)) {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;

    // Utiliser exactement le même format que la requête cURL qui fonctionne avec Swagger
    const now = new Date();

    // Formater les dates au format attendu par le backend (sans les millisecondes et le Z)
    const formatDate = (date: Date | null): string => {
      if (!date) {
        date = now;
      }
      // Format: yyyy-MM-dd'T'HH:mm:ss (comme dans le cURL qui fonctionne)
      return date.toISOString().split('.')[0];
    };

    // Créer un payload qui correspond EXACTEMENT au format de la requête cURL qui fonctionne
    const payload = {
      // Utiliser les noms de propriétés EXACTS de la requête cURL
      "maxValue": this.newCreditPool.max_value || 0.5,
      "minValue": this.newCreditPool.min_value || 0.1,
      "n_Echeance": this.newCreditPool.n_echeance || 10,
      "pool_Sum": this.newCreditPool.pool_sum || 10000.0,
      "full": this.newCreditPool.full ?? true,
      "open_Date": formatDate(this.newCreditPool.open_date),
      "close_Date": formatDate(this.newCreditPool.close_date || new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000)),
      "grace_Period": formatDate(this.newCreditPool.grace_period || new Date()),
      "Period": formatDate(this.newCreditPool.period || new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000))
    };

    console.log('Sending payload to API:', payload);

    this.creditPoolService.addCreditPool(payload).subscribe({
      next: (creditPool) => {
        const formattedCreditPool = CreditPool.fromJson(creditPool);
        this.creditPools.unshift(formattedCreditPool);
        this.resetForm();
        this.snackBar.open('Credit pool created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error creating credit pool:', error);

        // Afficher plus de détails sur l'erreur
        let errorMessage = 'Failed to create credit pool';

        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        // Log complet pour le débogage
        console.log('Error details:', {
          status: error?.status,
          statusText: error?.statusText,
          message: errorMessage,
          error: error?.error
        });

        this.snackBar.open(
          errorMessage,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }





  updateCreditPool(): void {
    if (!this.selectedCreditPool) {
      this.setError('No credit pool selected for update');
      return;
    }

    if (!this.validateCreditPool(this.selectedCreditPool)) {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Ensure dates are Date objects before sending to the API
    if (this.selectedCreditPool.open_date) {
      this.selectedCreditPool.open_date = new Date(this.selectedCreditPool.open_date);
    }
    if (this.selectedCreditPool.close_date) {
      this.selectedCreditPool.close_date = new Date(this.selectedCreditPool.close_date);
    }
    if (this.selectedCreditPool.grace_period) {
      this.selectedCreditPool.grace_period = new Date(this.selectedCreditPool.grace_period);
    }
    if (this.selectedCreditPool.period) {
      this.selectedCreditPool.period = new Date(this.selectedCreditPool.period);
    }

    this.isLoading = true;
    this.creditPoolService.updateCreditPool(this.selectedCreditPool).subscribe({
      next: (updatedCreditPool) => {
        // Convert string dates to Date objects
        const formattedCreditPool = CreditPool.fromJson(updatedCreditPool);
        const index = this.creditPools.findIndex(cp => cp.id_credit_pool === formattedCreditPool.id_credit_pool);
        if (index !== -1) {
          this.creditPools[index] = formattedCreditPool;
        }
        this.snackBar.open('Credit pool updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Error updating credit pool:', error);
        this.setError('Failed to update credit pool');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteCreditPool(id: any): void {
    // Ensure id is a valid number before proceeding
    if (id === undefined || id === null || id === 'undefined' || isNaN(Number(id))) {
      this.snackBar.open('Invalid credit pool ID', 'Close', { duration: 3000 });
      return;
    }

    // Convert to number to ensure proper typing
    const numericId = Number(id);
    this.isLoading = true;

    this.creditPoolService.removeCreditPool(numericId).subscribe({
      next: (response) => {
        // Même si la réponse est vide, on considère l'opération comme réussie si on arrive ici
        this.creditPools = this.creditPools.filter(p => p.id_credit_pool !== numericId);
        this.snackBar.open('Credit pool deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Recharger la liste pour s'assurer qu'elle est à jour
        this.loadCreditPools();
      },
      error: (err) => {
        console.error('Error deleting credit pool:', err);

        // Vérifier si l'erreur est un statut 200 (ce qui n'est pas vraiment une erreur)
        if (err.status === 200) {
          // Traiter comme un succès malgré l'erreur Angular
          this.creditPools = this.creditPools.filter(p => p.id_credit_pool !== id);
          this.snackBar.open('Credit pool deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          // Recharger la liste pour s'assurer qu'elle est à jour
          this.loadCreditPools();
        } else {
          // C'est une vraie erreur
          this.snackBar.open('Error deleting credit pool: ' + (err.error?.message || err.message || 'Unknown error'), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  selectCreditPool(creditPool: CreditPool): void {
    this.isEditing = true;

    // Create a deep copy using JSON to ensure all properties are properly copied
    this.selectedCreditPool = JSON.parse(JSON.stringify(creditPool));

    console.log('Selected credit pool for editing:', this.selectedCreditPool);
  }

  resetForm(): void {
    this.newCreditPool = new CreditPool();
    this.showAddForm = false;
  }

  cancelEdit(): void {
    this.selectedCreditPool = null;
    this.isEditing = false;
  }

  setError(message: string): void {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  clearError(): void {
    this.error = null;
  }

  searchCreditPoolById(): void {
    if (!this.searchId) {
      this.setError('Please enter a valid Credit Pool ID');
      return;
    }

    this.isSearching = true;
    this.searchError = null;
    this.searchResult = null;

    this.creditPoolService.retrieveCreditPoolById(this.searchId).subscribe({
      next: (creditPool) => {
        this.searchResult = creditPool;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error searching for credit pool:', error);
        this.searchError = 'Credit Pool not found or an error occurred';
        this.isSearching = false;
      }
    });
  }

  clearSearch(): void {
    this.searchId = null;
    this.searchResult = null;
    this.searchError = null;
  }

  calculateInterestRates(creditPool: CreditPool): void {
    if (!creditPool || !creditPool.id_credit_pool) {
      this.setError('Invalid credit pool selected');
      return;
    }

    this.isLoadingRates = true;
    this.ratesError = null;
    this.selectedPoolForRates = creditPool;

    this.creditPoolService.calculateInterestRatesForPool(creditPool.id_credit_pool).subscribe({
      next: (rates: Record<string, number>) => {
        console.log('Interest rates received:', rates);
        // Convert the object to a Map
        this.interestRates = new Map<number, number>();
        Object.keys(rates).forEach(key => {
          this.interestRates.set(Number(key), rates[key]);
        });
        this.isLoadingRates = false;
      },
      error: (error) => {
        console.error('Error calculating interest rates:', error);
        this.ratesError = 'Failed to calculate interest rates: ' + (error.error || error.message || 'Unknown error');
        this.isLoadingRates = false;
      }
    });
  }

  clearInterestRates(): void {
    this.interestRates = new Map<number, number>();
    this.selectedPoolForRates = null;
    this.ratesError = null;
  }

  formatInterestRate(rate: number): string {
    return rate ? rate.toFixed(1) + '%' : 'N/A';
  }

  validateCreditPool(creditPool: any): boolean {
    // Use getters to access values regardless of which property names are used
    return creditPool &&
      creditPool.pool_Sum !== null &&
      creditPool.pool_Sum !== undefined &&
      creditPool.pool_Sum > 0 &&
      creditPool.minValue !== null &&
      creditPool.minValue !== undefined &&
      creditPool.minValue >= 0 &&
      creditPool.maxValue !== null &&
      creditPool.maxValue !== undefined &&
      creditPool.maxValue > 0 &&
      creditPool.n_Echeance !== null &&
      creditPool.n_Echeance !== undefined &&
      creditPool.n_Echeance > 0;
  }

  getStatusText(creditPool: CreditPool): string {
    return creditPool.full ? 'Full' : 'Available';
  }

  getStatusColor(creditPool: CreditPool): string {
    return creditPool.full ? 'warn' : 'primary';
  }

  /**
   * Applies filter to the data source
   * @param filterValue Text to filter by
   */
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Calculates the average interest rate from all rates in the map
   * @returns The average interest rate or 0 if no rates exist
   */
  calculateAverageRate(): number {
    if (!this.interestRates || this.interestRates.size === 0) {
      return 0;
    }

    let sum = 0;
    this.interestRates.forEach((rate) => {
      sum += rate;
    });

    return sum / this.interestRates.size;
  }
}
