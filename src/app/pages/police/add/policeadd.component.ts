import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoliceService } from '../../../services/police.service';
import { Police } from '../police.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-policeadd',
  templateUrl: './policeadd.component.html',
  styleUrls: ['./policeadd.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ]
})
export class PoliceaddComponent implements OnInit {
  policeForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private policeService: PoliceService
  ) {
    this.policeForm = this.fb.group({
      active: [true],
      start: [null, Validators.required],
      end: [null, [Validators.required, this.futureDateValidator]],
      amount: [null, [Validators.required, Validators.min(0)]],
      frequency: ['', Validators.required],
      renewalDate: [null, [Validators.required, this.futureDateValidator]]
    });

    // Initialize form values
    this.policeForm.patchValue({
      active: true,
      frequency: 'MONTHLY'
    });
  }

  private futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const date = control.value;
    if (date && date < new Date()) {
      return { future: true };
    }
    return null;
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.policeForm.valid) {
      console.log('Form is invalid:', this.policeForm.errors);
      Object.keys(this.policeForm.controls).forEach(field => {
        const control = this.policeForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const police: Police = {
      active: this.policeForm.get('active')?.value,
      start: this.policeForm.get('start')?.value,
      end: this.policeForm.get('end')?.value,
      amount: this.policeForm.get('amount')?.value,
      frequency: this.policeForm.get('frequency')?.value,
      renewalDate: this.policeForm.get('renewalDate')?.value,
      userId: 1
    };

    console.log('Submitting police:', police); // Debug log

    this.loading = true;
    this.policeService.addPolice(police).subscribe({
      next: (response: any) => {
        console.log('Response:', response); // Debug log
        this.snackBar.open('Insurance policy added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/admin/police']);
      },
      error: (error: any) => {
        console.error('Error response:', error); // Debug log
        let errorMessage = 'Error adding insurance policy';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/police']);
  }
}