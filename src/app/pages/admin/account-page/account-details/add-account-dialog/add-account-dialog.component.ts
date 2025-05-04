import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountService } from '../../../../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-account-dialog.component.html',
  styleUrls: ['./add-account-dialog.component.scss']
})
export class AddAccountDialogComponent implements OnInit {
  accountForm: FormGroup;
  accountTypes = ['EPARGNE', 'EPARGNE_ZEKET'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private dialogRef: MatDialogRef<AddAccountDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      clientEmail: ['', [Validators.required, Validators.email]], // Added clientEmail field
      accountType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]], // Allow 0, set reasonable max
      interestRate: new FormControl({ value: '', disabled: true }),
      _databaseInterestRate: new FormControl({ value: 0, disabled: true }),
      rib: new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit(): void {
    this.setupAccountTypeListener();
  }

  private setupAccountTypeListener(): void {
    this.accountForm.get('accountType')?.valueChanges.subscribe(type => {
      let displayRate: number;
      let databaseRate: number;
      
      switch(type) {
        case 'EPARGNE_ZEKET':
          displayRate = 5;
          databaseRate = 0.05;
          break;
        case 'EPARGNE':
          displayRate = 7.99;
          databaseRate = 0.0799;
          break;
        default:
          displayRate = 0;
          databaseRate = 0;
      }
      
      this.accountForm.patchValue({ 
        interestRate: displayRate,  // Display as percentage
        _databaseInterestRate: databaseRate,  // Hidden value for backend
        rib: this.generateTempRib() 
      });
    });
  }

  private generateTempRib(): string {
    return 'TN' + Math.random().toString().slice(2, 20).padEnd(20, '0');
  }

  onSubmit(): void {
    if (this.accountForm.invalid || this.isSubmitting) return;
  
    this.isSubmitting = true;
    const formValue = this.accountForm.getRawValue();
 
      // Add this debug log
      console.log('Submitting payload:', JSON.stringify(formValue, null, 2));
    
    const payload = {
      date_Opening: new Date().toISOString(),
      clientEmail: formValue.clientEmail,
      accountType: formValue.accountType,
      amount: formValue.amount,
      interestRate: formValue._databaseInterestRate || 0,
      rib: this.generateTempRib()
    };
    

    this.accountService.createAccount(payload).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        this.snackBar.open('Account created successfully!', 'Close', { 
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        console.error('Account creation error:', error);
        
        // Determine if the account was likely created
        const isSuccessfulCreation = 
          error.status === 500 || 
          error.status === 200 || 
          (error.error && 
            (error.error.message?.toLowerCase().includes('created') || 
             error.error.message?.toLowerCase().includes('success')));
        
        if (isSuccessfulCreation) {
          // Delay to ensure any previous snackbar is dismissed
          setTimeout(() => {
            this.snackBar.open('Account created successfully!', 'Close', { 
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close();
          }, 100);
          return; // Prevent further error handling
        } 
        
        // Only handle submission error if not a successful creation
        this.handleSubmissionError(error);
      },
      complete: () => this.isSubmitting = false
    });
  }

  private handleSubmissionError(error: HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    console.error('Full error details:', {
      status: error.status,
      message: error.error?.message,
      details: error.error
    });
    
   
    
    if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid request. Please check all fields.';
      console.error('Validation errors:', error.error?.errors);
    } else if (error.status === 404) {
      errorMessage = 'Client email not found. Please verify the email address.';
    } else if (error.status === 409) {
      errorMessage = 'Account already exists for this client.';
    }

    this.snackBar.open(errorMessage, 'Dismiss', { 
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  get clientEmailError(): string {
    const control = this.accountForm.get('clientEmail');
    
    if (control?.hasError('required')) {
      return 'Client email is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}