import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { Person } from './person.model';
import { PoliceService } from '../../services/police.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PersonComponent implements OnInit {
  personForm: FormGroup;
  submitted = false;
  loading = false;
  policeList: any[] = [];
  selectedFilePath: string | null = null;
  isValidFileType = true;

  constructor(
    private formBuilder: FormBuilder,
    private personService: PersonService,
    private policeService: PoliceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
    this.loadPoliceList();
  }

  ngOnInit(): void {
    this.loadPoliceList();
  }

  private initializeForm(): void {
    this.personForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      cin: ['', [Validators.required, Validators.pattern('\\d{8}')]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      revenue: ['', [Validators.required, Validators.min(0)]],
      active: [true],
      documents: ['', Validators.required],
      police_id: ['', Validators.required]
    });
  }

  get formControls() {
    return this.personForm.controls;
  }

  private loadPoliceList(): void {
    this.policeService.getPoliceList().subscribe(
      (police) => {
        this.policeList = police;
      },
      (error) => {
        console.error('Error loading police list:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        this.snackBar.open('Please select a PDF file only', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.isValidFileType = false;
        return;
      }

      this.selectedFilePath = file.name;
      this.personForm.patchValue({
        documents: file.name,
        filePath: file.name
      });
      this.isValidFileType = true;
    }
  }

  onSubmit(): void {
    if (this.personForm.invalid) {
      return;
    }

    if (!this.selectedFilePath) {
      this.snackBar.open('Please select a PDF file', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (!this.isValidFileType) {
      this.snackBar.open('Please select a valid PDF file', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.loading = true;
    const person: Person = {
      idGarantie: null,
      name: this.personForm.get('name')?.value,
      lastName: this.personForm.get('last_name')?.value,
      cin: this.personForm.get('cin')?.value,
      email: this.personForm.get('email')?.value,
      age: this.personForm.get('age')?.value,
      revenue: this.personForm.get('revenue')?.value,
      active: this.personForm.get('active')?.value,
      documents: this.personForm.get('documents')?.value,
      policeId: this.personForm.get('police_id')?.value,
      filePath: this.selectedFilePath
    };

    this.personService.addPerson(person).subscribe({
      next: (response) => {
        this.loading = false;
        this.resetForm();
        this.snackBar.open('Person added successfully with document path!', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error adding person: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  resetForm(): void {
    this.personForm.reset();
    this.submitted = false;
    this.loading = false;
    this.selectedFilePath = null;
    this.isValidFileType = true;
  }
}
