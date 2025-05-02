import { Component, OnInit } from '@angular/core';
import { Contract } from '../contract.model';
import { ContractService } from '../contract.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

function pastOrPresentDateValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const selectedDate = new Date(control.value);
  const now = new Date();
  if (selectedDate > now) {
    return { futureDate: true };
  }
  return null;
}

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
  contractsList: Contract[] = [];
  selectedContract: Contract | null = null;
  contractForm: FormGroup;
  showForm: boolean = false;
  sinistresList: any[] = [];
  displayedColumns: string[] = [
    'idContrat',
    'date',
    'name',
    'contact',
    'coverageLimit',
    'premium',
    'sinistre',
    'actions',
  ];

  // Pagination properties
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;

  // Search properties
  searchIdContrat: number | null = null;
  searchName: string = '';
  searchDate: string = '';

  constructor(
    private contractService: ContractService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.contractForm = this.fb.group({
      date: [new Date(), [Validators.required, pastOrPresentDateValidator]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      coverageLimit: [0, [Validators.required, Validators.min(0)]],
      premium: [0, [Validators.required, Validators.min(0)]],
      sinistre: [null],
    });
  }

  ngOnInit(): void {
    this.loadContracts();
    this.loadSinistres();
  }

  loadContracts(): void {
    this.contractService
      .getContractsPaginatedAndSearch(
        this.page,
        this.size,
        this.searchIdContrat,
        this.searchName,
        this.searchDate
      )
      .subscribe(
        (data: any) => {
          this.contractsList = data.content;
          console.log("Contracts List:", this.contractsList); // Add this line
          this.totalElements = data.totalElements;
          this.page = data.number; // Current page number
          this.size = data.size;   // Page size
        },
        (error: any) => {
          console.error('Error fetching contracts:', error);
          this.snackBar.open('Error fetching contracts', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  loadSinistres(): void {
    this.contractService.getSinistres().subscribe(
      (data: any[]) => {
        this.sinistresList = data;
      },
      (error: any) => {
        console.error('Error fetching sinistres:', error);
        this.snackBar.open('Error fetching sinistres', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  onSubmit(): void {
    if (this.contractForm.invalid) {
      return;
    }

    const formValue = this.contractForm.value;
    const newContract: Contract = {
      idContrat: this.selectedContract?.idContrat,
      date: new Date(formValue.date).toISOString(),
      name: formValue.name,
      contact: formValue.contact,
      coverageLimit: formValue.coverageLimit,
      premium: formValue.premium,
      sinistre: formValue.sinistre === null ? null : formValue.sinistre,
    };

    if (this.selectedContract?.idContrat !== undefined) {
      this.contractService
        .updateContract(this.selectedContract.idContrat, newContract)
        .subscribe(
          (updatedContract) => {
            const index = this.contractsList.findIndex(
              (c) => c.idContrat === updatedContract.idContrat
            );
            if (index !== -1) {
              this.contractsList[index] = updatedContract;
            }
            this.selectedContract = null;
            this.showForm = false;
            this.loadContracts();
            this.snackBar.open('Contract updated successfully', 'Close', {
              duration: 3000,
            });
            this.contractForm.reset();
          },
          (error) => {
            console.error('Error updating contract:', error);
            this.snackBar.open('Error updating contract', 'Close', {
              duration: 3000,
            });
          }
        );
    } else {
      this.contractService.addContract(newContract).subscribe(
        (addedContract) => {
          this.contractsList.push(addedContract);
          this.contractForm.reset();
          this.showForm = false;
          this.loadContracts();
          this.snackBar.open('Contract added successfully', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error adding contract:', error);
          this.snackBar.open('Error adding contract', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  showAddContractForm() {
    this.showForm = true;
    this.selectedContract = null;
    this.contractForm.reset();
  }

  cancelAddContract() {
    this.showForm = false;
    this.contractForm.reset();
  }

  selectContract(contract: Contract): void {
    this.selectedContract = contract;
    this.contractForm.patchValue({
      date: contract.date,
      name: contract.name,
      contact: contract.contact,
      coverageLimit: contract.coverageLimit,
      premium: contract.premium,
      sinistre: contract.sinistre,
    });
    this.showForm = true;
  }

  deleteContract(id: number | undefined): void {
    if (id !== undefined) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { message: 'Are you sure you want to delete this contract?' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.contractService.deleteContract(id).subscribe(
            () => {
              this.contractsList = this.contractsList.filter(
                (contract) => contract.idContrat !== id
              );
              this.selectedContract = null;
              this.loadContracts();
              this.snackBar.open('Contract deleted successfully', 'Close', {
                duration: 3000,
              });
            },
            (error) => {
              console.error('Error deleting contract:', error);
              this.snackBar.open('Error deleting contract', 'Close', {
                duration: 3000,
              });
            }
          );
        }
      });
    }
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadContracts();
  }

  searchContracts(): void {
    this.page = 0; // Reset page number to 0
    this.size = 5; // Reset page size to default (or whatever your default is)

    this.contractService
      .getContractsPaginatedAndSearch(
        this.page,
        this.size,
        this.searchIdContrat,
        this.searchName,
        this.searchDate
      )
      .subscribe(
        (data: any) => {
          this.contractsList = data.content;
          this.totalElements = data.totalElements;
          // Keep the current page and size from the response
          // this.page = data.number;
          // this.size = data.size;
        },
        (error: any) => {
          console.error('Error fetching contracts:', error);
          this.snackBar.open('Error fetching contracts', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  clearSearch(): void {
    this.searchIdContrat = null;
    this.searchName = '';
    this.searchDate = '';
    this.page = 0;
    this.loadContracts();
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content>
      {{ data.message }}
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button color="primary" [mat-dialog-close]="true">Confirm</button>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
