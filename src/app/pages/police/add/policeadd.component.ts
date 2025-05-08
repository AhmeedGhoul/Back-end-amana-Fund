import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  policeForm!: FormGroup;
  loading = false;
  editMode = false;
  police!: Police;
  users: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private policeService: PoliceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchUsers(); // ⬅️ fetch users from API

    this.route.queryParams.subscribe(params => {
      const id = params['id'] || params['idPolice'];
      if (id) {
        this.editMode = true;
        this.loadPolice(Number(id));
      }
    });

    this.initForm();
  }
  private fetchUsers(): void {
    this.policeService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.snackBar.open('Failed to load users', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  

  private initForm(): void {
    this.policeForm = this.formBuilder.group({
      active: [true],
      start: [null, Validators.required],
      end: [null, [Validators.required, this.futureDateValidator]],
      amount: [null, [Validators.required, Validators.min(0)]],
      frequency: ['', Validators.required],
      renewalDate: [null, [Validators.required, this.futureDateValidator]],
      userId: [1, Validators.required]  // Default to 1 if not editing
    });

    this.policeForm.patchValue({
      active: true,
      frequency: 'MONTHLY'
    });
  }

  private loadPolice(id: number): void {
    console.log('Fetching police with ID:', id);
    this.loading = true;
    this.policeService.getPoliceById(id).subscribe({
      next: (police: Police) => {
        console.log('Successfully loaded police:', police);
        this.police = police;
        // Set the form values including userId
        this.policeForm.patchValue({
          active: police.active,
          start: police.start,
          end: police.end,
          amount: police.amount,
          frequency: police.frequency,
          renewalDate: police.renewalDate,
          userId: police.userId || 1  // Fallback to 1 if userId is null
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading police:', error);
        this.loading = false;
        this.snackBar.open('Error loading policy: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  

  private futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const date = control.value;
    if (date && date < new Date()) {
      return { future: true };
    }
    return null;
  }

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
      idPolice: this.editMode ? this.police.idPolice : undefined,
      active: this.policeForm.get('active')?.value,
      start: this.policeForm.get('start')?.value,
      end: this.policeForm.get('end')?.value,
      amount: this.policeForm.get('amount')?.value,
      frequency: this.policeForm.get('frequency')?.value,
      renewalDate: this.policeForm.get('renewalDate')?.value,
      userId: this.policeForm.get('userId')?.value || 1  // Get userId from form or fallback to 1
    };

    console.log('Submitting police:', police); // Debug log

    this.loading = true;
    if (this.editMode) {
      this.policeService.updatePolice(police).subscribe({
        next: (response: any) => {
          console.log('Response:', response); // Debug log
          this.snackBar.open('Insurance policy updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/police']);
        },
        error: (error: any) => {
          console.error('Error response:', error); // Debug log
          let errorMessage = 'Error updating insurance policy';
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
    } else {
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
  }

  onCancel(): void {
    this.router.navigate(['/admin/police']);
  }
}