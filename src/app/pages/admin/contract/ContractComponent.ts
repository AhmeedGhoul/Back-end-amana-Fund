import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Contract } from '../../../Models/Contract';
import { ContractService } from '../../../services/Contract.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { CreditPoolService } from '../../../services/CreditPool.service';
import { CreditPool } from '../../../Models/CreditPool';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {  
  // Refactor functionality
  showRefactorSidebar = false;
  refactoringContract: Contract | null = null;
  refactoredPayments: any[] = [];
  isRefactoring = false;
  contracts: Contract[] = [];
  newContract: Contract = new Contract();
  selectedContract: Contract | null = null;
  showForm: boolean = false;
  users: User[] = [];
  creditPools: CreditPool[] = [];
  loadingUsers: boolean = false;
  loadingCreditPools: boolean = false;
  generatingPdf: boolean = false;

  constructor(
    @Inject(ContractService) private contractService: ContractService,
    @Inject(UserService) private userService: UserService,
    @Inject(CreditPoolService) private creditPoolService: CreditPoolService,
    @Inject(PdfService) private pdfService: PdfService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadContracts();
    this.loadUsers();
    this.loadCreditPools();
  }

  loadCreditPools(): void {
    this.loadingCreditPools = true;
    this.creditPoolService.retrieveCreditPools().subscribe(
      (response) => {
        this.creditPools = response;
        this.loadingCreditPools = false;
      },
      (error) => {
        console.error('Error loading credit pools:', error);
        this.loadingCreditPools = false;
      }
    );
  }

  loadUsers(): void {
    this.loadingUsers = true;
    console.log('Attempting to load users...');
    
    // Try with a larger page size to get all users
    this.userService.getUsers(0, 1000).subscribe(
      (response) => {
        console.log('Full user response:', response);
        
        if (response && Array.isArray(response.content) && response.content.length > 0) {
          this.users = response.content;
          console.log('Users loaded successfully:', this.users.length);
        } else if (response && Array.isArray(response)) {
          // Handle case where API might return array directly instead of paged response
          this.users = response;
          console.log('Users loaded as direct array:', this.users.length);
        } else {
          console.warn('User response was empty or invalid format:', response);
          // Add a placeholder to indicate the issue
          this.users = [{ 
            id: -1, 
            firstName: 'Error', 
            lastName: 'Loading Users', 
            email: '', 
            phoneNumber: '', 
            age: 0, 
            address: '', 
            civilStatus: '', 
            createdDate: '', 
            dateOfBirth: '', 
            enabled: false, 
            accountLocked: false, 
            accountDeleted: false, 
            lastModifiedDate: '', 
            userScore: 0 
          }];
        }
        this.loadingUsers = false;
      },
      (error) => {
        console.error('Error loading users:', error);
        // Add a placeholder to indicate the error
        this.users = [{ 
          id: -1, 
          firstName: 'Error', 
          lastName: 'Loading Users', 
          email: '', 
          phoneNumber: '', 
          age: 0, 
          address: '', 
          civilStatus: '', 
          createdDate: '', 
          dateOfBirth: '', 
          enabled: false, 
          accountLocked: false, 
          accountDeleted: false, 
          lastModifiedDate: '', 
          userScore: 0 
        }];
        this.loadingUsers = false;
      }
    );
  }

  loadContracts(): void {
    this.contractService.retrieveContracts().subscribe(
      (contracts) => {
        console.log('Contracts received:', contracts);
        
        // Inspect the first contract to understand the structure
        if (contracts.length > 0) {
          console.log('First contract structure:', JSON.stringify(contracts[0], null, 2));
          console.log('First contract ID:', contracts[0].id_Contract);
          
          // Check for nested objects and ID fields
          if (contracts[0].user) {
            console.log('User object found:', contracts[0].user);
          }
          if (contracts[0].creditPool) {
            console.log('CreditPool object found:', contracts[0].creditPool);
          }
          
          // Check for other ID-related fields
          console.log('Contract raw properties:', Object.keys(contracts[0]));
          for (const key of Object.keys(contracts[0])) {
            if (key.toLowerCase().includes('id')) {
              // Use type assertion to avoid TypeScript error
              console.log(`ID field found: ${key} = ${(contracts[0] as any)[key]}`);
            }
          }
        }  
        
        // Ensure all contracts are properly transformed to Contract objects
        this.contracts = contracts.map(contract => {
          // Make sure dates are properly handled
          if (typeof contract.date_Contract === 'string' && contract.date_Contract) {
            try {
              contract.date_Contract = new Date(contract.date_Contract);
              // Validate the date is valid
              if (isNaN(contract.date_Contract.getTime())) {
                console.warn('Invalid date after parsing date_Contract:', contract.date_Contract);
                // Set a default date instead of null to ensure it displays
                contract.date_Contract = new Date();
              }
            } catch (e) {
              console.error('Error parsing date_Contract:', e);
              // Set a default date instead of null
              contract.date_Contract = new Date();
            }
          } else if (!contract.date_Contract) {
            // If date is null or undefined, set a default date
            contract.date_Contract = new Date();
          }
          
          if (typeof contract.withdrawal_date === 'string' && contract.withdrawal_date) {
            try {
              contract.withdrawal_date = new Date(contract.withdrawal_date);
              // Validate the date is valid
              if (isNaN(contract.withdrawal_date.getTime())) {
                console.warn('Invalid date after parsing withdrawal_date:', contract.withdrawal_date);
                // Set a default future date
                const futureDate = new Date();
                futureDate.setMonth(futureDate.getMonth() + 1);
                contract.withdrawal_date = futureDate;
              }
            } catch (e) {
              console.error('Error parsing withdrawal_date:', e);
              // Set a default future date
              const futureDate = new Date();
              futureDate.setMonth(futureDate.getMonth() + 1);
              contract.withdrawal_date = futureDate;
            }
          } else if (!contract.withdrawal_date) {
            // If withdrawal date is null or undefined, set a default future date
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 1);
            contract.withdrawal_date = futureDate;
          }
          
          // Debug contract IDs and dates
          console.log(`Contract ID: ${contract.id_Contract}, type: ${typeof contract.id_Contract}`);
          console.log(`Contract dates: date_Contract=${contract.date_Contract}, withdrawal_date=${contract.withdrawal_date}`);
          
          if (contract.id_Contract === null || contract.id_Contract === undefined) {
            console.warn('Contract has null or undefined ID:', contract);
          }
          
          return contract;
        });
        console.log('Processed contracts:', this.contracts);
      },
      (error) => {
        console.error('Error loading contracts:', error);
      }
    );
  }

  createContract(): void {
    // Validate required fields
    if (!this.newContract.amount) {
      alert('Please enter an amount for the contract');
      return;
    }
    
    if (!this.newContract.userId) {
      alert('Please select a user for the contract');
      return;
    }
    
    if (!this.newContract.id_credit_pool) {
      alert('Please select a credit pool for the contract');
      return;
    }
    
    // Ensure contract date is in the future (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    // Only set the date if it's not already set or if it's in the past
    if (!this.newContract.date_Contract || this.newContract.date_Contract <= new Date()) {
      this.newContract.date_Contract = tomorrow;
    }
    
    // Set withdrawal date to a future date if not set
    if (!this.newContract.withdrawal_date) {
      const futureDate = new Date(tomorrow);
      futureDate.setMonth(futureDate.getMonth() + 1); // One month in the future
      this.newContract.withdrawal_date = futureDate;
    }
    
    console.log('Sending contract with dates:', {
      date_Contract: this.newContract.date_Contract,
      withdrawal_date: this.newContract.withdrawal_date,
      userId: this.newContract.userId,
      id_credit_pool: this.newContract.id_credit_pool,
      amount: this.newContract.amount
    });
    
    this.contractService.addContract(this.newContract).subscribe(
      (response) => {
        console.log('Contract created successfully, raw response:', response);
        console.log('Response type:', typeof response);
        console.log('Response properties:', Object.keys(response));
        
        // Check if the response has an ID
        if (response && response.id_Contract) {
          console.log('New contract ID received:', response.id_Contract);
        } else {
          console.warn('No contract ID received in the response');
          // Check for other ID fields
          for (const key of Object.keys(response)) {
            if (key.toLowerCase().includes('id')) {
              // Use type assertion to avoid TypeScript error
              console.log(`ID field found in response: ${key} = ${(response as any)[key]}`);
            }
          }
        }
        
        this.loadContracts();
        this.showForm = false;
        this.newContract = new Contract();
      },
      (error) => {
        console.error('Error creating contract:', error);
        
        // Extract detailed error message
        let errorMessage = 'Unknown error';
        
        if (error.error && typeof error.error === 'string') {
          // Direct error message from backend
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          // Structured error object
          errorMessage = error.error.message;
        } else if (error.message) {
          // HTTP error message
          errorMessage = error.message;
        } else if (error.status === 500) {
          errorMessage = 'Server error (500): The contract could not be created. This might be due to: Missing required fields, invalid date format, invalid credit pool ID, or database constraints violation.';
        }
        
        // Log the contract data that was sent for debugging
        console.log('Contract data that caused the error:', JSON.stringify(this.newContract, null, 2));
        
        // Show error message to user
        alert('Error creating contract: ' + errorMessage);
      }
    );
  }

  updateContract(): void {
    if (this.selectedContract) {
      console.log('Attempting to update contract:', this.selectedContract);
      
      // Validate contract has an ID
      if (!this.selectedContract.id_Contract) {
        alert('Cannot update contract: Missing contract ID');
        return;
      }
      
      this.contractService.updateContract(this.selectedContract).subscribe(
        (updatedContract) => {
          console.log('Contract updated successfully:', updatedContract);
          this.selectedContract = null;
          this.loadContracts();
          alert('Contract updated successfully');
        },
        (error) => {
          console.error('Error updating contract', error);
          
          // Extract detailed error message
          let errorMessage = 'Unknown error';
          
          if (error.error && typeof error.error === 'string') {
            // Direct error message from backend
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            // Structured error object
            errorMessage = error.error.message;
          } else if (error.message) {
            // HTTP error message
            errorMessage = error.message;
          } else if (error.status === 500) {
            errorMessage = 'Server error (500): The contract could not be updated. This might be due to: Missing required fields, invalid date format, invalid IDs, or database constraints violation.';
          }
          
          alert('Error updating contract: ' + errorMessage);
        }
      );
    }
  }

  deleteContract(id: number): void {
    // Get the contract object from the contracts array to get more information
    const contractToDelete = this.contracts.find(c => c.id_Contract === id);
    
    if (!contractToDelete) {
      alert('Contract not found in the current list.');
      return;
    }
    
    console.log('Contract to delete:', contractToDelete);
    
    // Check if the contract has a valid ID
    if (!id || id === 0) {
      alert('Invalid contract ID. Cannot delete contract.');
      return;
    }

    console.log('Attempting to delete contract with ID:', id);
    
    this.contractService.removeContract(id).subscribe(
      (response) => {
        console.log('Delete response:', response);
        
        // Reload the contracts list from the server to ensure we have the latest data
        this.loadContracts();
        
        // Show success message
        alert('Contract deleted successfully');
      },
      (error) => {
        console.error('Error deleting contract', error);
        
        // Even with a 200 status, it might be treated as an error due to response type
        if (error.status === 200) {
          // This is actually a success case
          this.loadContracts();
          alert('Contract deleted successfully');
        } else {
          alert('Error deleting contract: ' + (error.message || 'Unknown error'));
        }
      }
    );
  }

  selectContract(contract: Contract): void {
    console.log('Original contract being selected:', contract);
    
    // Create a deep copy to ensure we don't lose any properties
    this.selectedContract = JSON.parse(JSON.stringify(contract));
    
    // Double check that the ID is preserved
    if (this.selectedContract && (!this.selectedContract.id_Contract || this.selectedContract.id_Contract === 0)) {
      console.warn('Contract ID was lost during selection, original ID was:', contract.id_Contract);
      
      // Try to recover the ID
      if (contract.id_Contract) {
        this.selectedContract.id_Contract = contract.id_Contract;
      }
    }
    
    console.log('Selected contract after processing:', this.selectedContract);
  }

  displayContracts(): void {
    this.showForm = !this.showForm;
    
    // If showing the form, reload users and credit pools
    if (this.showForm) {
      this.loadUsers();
      this.loadCreditPools();
    }
  }
  
  /**
   * Opens the refactor sidebar for a contract and loads its payment schedule
   * @param contract The contract to refactor
   */
  openRefactorSidebar(contract: Contract): void {
    // Create a deep copy to avoid modifying the original contract
    this.refactoringContract = JSON.parse(JSON.stringify(contract));
    this.showRefactorSidebar = true;
    this.loadPayments(contract.id_Contract);
  }

  /**
   * Loads the current payment schedule for a contract
   * @param contractId The ID of the contract
   */
  loadPayments(contractId: number): void {
    this.contractService.getRefactoredPayments(contractId).subscribe(
      (payments) => {
        this.refactoredPayments = payments;
        console.log('Loaded payments:', payments);
      },
      (error) => {
        console.error('Error loading payments:', error);
        this.snackBar.open('Error loading payment schedule: ' + error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  /**
   * Refactors the payment schedule for a contract
   * @param contractId The ID of the contract to refactor
   */
  refactorContract(contractId: number): void {
    if (!contractId) {
      this.snackBar.open('Cannot refactor: Invalid contract ID', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isRefactoring = true;
    this.contractService.refactorEcheances(contractId).subscribe(
      (response) => {
        console.log('Refactor response:', response);
        this.isRefactoring = false;
        this.snackBar.open('Payment schedule successfully refactored', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Reload the payments to show the updated schedule
        this.loadPayments(contractId);
      },
      (error) => {
        console.error('Error refactoring payment schedule:', error);
        this.isRefactoring = false;
        this.snackBar.open('Error refactoring payment schedule: ' + error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  /**
   * Closes the refactor sidebar
   */
  closeRefactorSidebar(): void {
    this.showRefactorSidebar = false;
    this.refactoringContract = null;
    this.refactoredPayments = [];
  }

  /**
   * Generates a PDF for the specified contract and downloads it
   * @param contract The contract to generate a PDF for
   */
  generatePdf(contract: Contract): void {
    if (!contract || !contract.id_Contract) {
      alert('Cannot generate PDF: Invalid contract');
      return;
    }
    
    console.log('Generating PDF for contract:', contract);
    this.generatingPdf = true;
    
    // Create a deep copy to ensure we don't lose any properties
    const contractCopy = JSON.parse(JSON.stringify(contract));
    
    this.pdfService.generateContractPdf(contractCopy).subscribe(
      (pdfBlob: Blob) => {
        console.log('PDF generated successfully');
        this.generatingPdf = false;
        
        // Create a file name for the PDF
        const contractId = contract.id_Contract || 'new';
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        const fileName = `contract_${contractId}_${dateStr}.pdf`;
        
        // Create a download link and trigger the download
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        
        alert('PDF generated successfully');
      },
      (error) => {
        console.error('Error generating PDF', error);
        this.generatingPdf = false;
        
        // Extract detailed error message
        let errorMessage = 'Unknown error';
        
        if (error.error && typeof error.error === 'string') {
          // Direct error message from backend
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          // Structured error object
          errorMessage = error.error.message;
        } else if (error.message) {
          // HTTP error message
          errorMessage = error.message;
        } else if (error.status === 500) {
          errorMessage = 'Server error (500): The PDF could not be generated. This might be due to missing required fields or invalid data.';
        }
        
        alert('Error generating PDF: ' + errorMessage);
      }
    );
  }
}
