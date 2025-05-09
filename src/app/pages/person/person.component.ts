import { Component, OnInit, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Person } from './person.model';
import { Police } from '../police/police.model';
import { PersonService } from '../../services/person.service';
import { PoliceService } from '../../services/police.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { RouterModule } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

// Define PersonDTO interface directly in the component
interface PersonDTO {
  idGarantie?: number | undefined;
  name: string;
  lastName: string;
  cin: string;
  email: string;
  age: number;
  revenue: number;
  active: boolean;
  documents: string;
  policeId: number;
  filePath: string | null;
}


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
    MatNativeDateModule,
    RouterModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: null }
  ]
})
export class PersonComponent implements OnInit {
  personForm: FormGroup;
  mode: 'add' | 'edit' = 'add';
  person: Person = new Person();
  policeList: Police[] = [];
  isSubmitting = false;
  error = '';
  selectedFilePath: string | null = null;
  uploadProgress = 0;
  showProgress = false;
  isValidFileType = true;
  submitted = false;
  loading = false;
  files: File[] = [];
  private injector: Injector;

  constructor(
    private formBuilder: FormBuilder,
    private personService: PersonService,
    private policeService: PoliceService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { person: Person; mode: 'add' | 'edit' } | null,
    injector: Injector
  ) {
    this.injector = injector;
    this.initializeForm();
    this.loadPoliceList();
  }

  ngOnInit(): void {
    if (this.data) {
      this.mode = this.data.mode;
      this.person = this.data.person;
      this.initializeForm();
    } else {
      // Check if we have state data (when coming from navigation)
      const state = history.state as { person: Person; mode: 'add' | 'edit' };
      if (state) {
        this.mode = state.mode;
        this.person = state.person;
        this.initializeForm();
      } else {
        this.mode = 'add';
        this.person = new Person();
        this.initializeForm();
      }
    }
  }

  private initializeForm(): void {
    // Initialize form with default values if person is undefined
    const initialPerson = this.person || new Person();

    this.personForm = this.formBuilder.group({
      name: [initialPerson.name || '', [Validators.required]],
      last_name: [initialPerson.lastName || '', [Validators.required]],
      cin: [initialPerson.cin || '', [Validators.required]],
      email: [initialPerson.email || '', [Validators.required, Validators.email]],
      age: [initialPerson.age || 0, [Validators.required, Validators.min(0)]],
      revenue: [initialPerson.revenue || 0, [Validators.required, Validators.min(0)]],
      active: [initialPerson.active || true],
      documents: [initialPerson.documents || ''],
      police_id: [initialPerson.policeId || null, [Validators.required]]
    });
  }

  get formControls() {
    return this.personForm.controls;
  }

  private loadPoliceList(): void {
    this.policeService.getPoliceList().subscribe(
      (police: Police[]) => {
        this.policeList = police;
      },
      (error: any) => {
        console.error('Error loading police list:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File | null = target.files?.[0] || null;

    if (!file) {
      this.selectedFilePath = null;
      this.isValidFileType = true;
      return;
    }

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      this.snackBar.open('Please select a PDF file only', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      this.isValidFileType = false;
      return;
    }

    this.selectedFilePath = file.name;
    this.personForm.patchValue({
      documents: file.name,
      filePath: file.name
    });
    this.files = [file];
  }

  onSubmit(): void {
    if (this.personForm.invalid) {
      return;
    }

    const person: Person = {
      idGarantie: this.person?.idGarantie || null,
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

    if (this.mode === 'edit') {
      this.updatePerson(person);
    } else {
      this.addPerson(person);
    }
  }

  private navigateBack(): void {
    if (this.data) {
      // If we have dialog data, we're in dialog mode
      const dialog = this.injector.get(MatDialogRef);
      dialog.close(true);
    } else {
      this.router.navigate(['/person']);
    }
  }

  private updatePerson(person: Person): void {
    this.isSubmitting = true;
    this.personService.updatePerson(person).subscribe({
      next: () => {
        this.snackBar.open('Person updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        this.router.navigate(['/person/list']);
      },
      error: (error: any) => {
        this.error = 'Failed to update person. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private addPerson(person: Person): void {
    if (!this.selectedFilePath) {
      this.snackBar.open('Please select a PDF file', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      return;
    }

    // Create a PersonDTO object with file path
    const personDTO: PersonDTO = {
      idGarantie: person.idGarantie || undefined,
      name: person.name,
      lastName: person.lastName,
      cin: person.cin,
      email: person.email,
      age: person.age,
      revenue: person.revenue,
      active: person.active,
      documents: this.selectedFilePath,
      policeId: person.policeId,
      filePath: this.selectedFilePath
    };

    this.isSubmitting = true;
    this.personService.addPerson(personDTO).subscribe({
      next: () => {
        this.snackBar.open('Person added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        this.router.navigate(['/person/list']);
      },
      error: (error: any) => {
        this.error = 'Failed to add person. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.personForm.reset();
    this.submitted = false;
    this.loading = false;
    this.selectedFilePath = null;
    this.isValidFileType = true;
    this.uploadProgress = 0;
    this.showProgress = false;
    this.error = '';
  }
}
