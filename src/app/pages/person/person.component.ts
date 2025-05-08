import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { PoliceService } from '../../services/police.service';
import { Police } from '../../pages/police/police.model';
import { Person } from './person.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  personForm: FormGroup;
  submitted = false;
  loading = false;
  policeList: Police[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private policeService: PoliceService
  ) {
    this.initializeForm();
    this.loadPoliceList();
  }

  ngOnInit(): void {
    this.loadPoliceList();
  }

  private initializeForm(): void {
    this.personForm = this.fb.group({
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
    this.policeService.getPoliceList().subscribe({
      next: (policeList) => {
        this.policeList = policeList;
      },
      error: (error) => {
        console.error('Error loading police list:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.personForm.invalid) {
      return;
    }

    this.loading = true;
    const personData = {
      idGarantie: null,
      name: this.personForm.get('name')?.value,
      lastName: this.personForm.get('last_name')?.value,
      cin: this.personForm.get('cin')?.value,
      email: this.personForm.get('email')?.value,
      age: this.personForm.get('age')?.value,
      revenue: this.personForm.get('revenue')?.value,
      active: this.personForm.get('active')?.value,
      documents: this.personForm.get('documents')?.value,
      policeId: this.personForm.get('police_id')?.value
    };

    this.personService.addPerson(personData).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Person added successfully!';
        this.personForm.reset();
        this.submitted = false;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'An error occurred while adding the person.';
      }
    );
  }

  resetForm(): void {
    this.personForm.reset();
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
