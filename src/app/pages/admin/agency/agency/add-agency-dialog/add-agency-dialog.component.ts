import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgencyService } from '../agency.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Agency, Governorate } from '../agency.model';

@Component({
  selector: 'app-add-agency-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-agency-dialog.component.html',
  styleUrls: ['./add-agency-dialog.component.css']
})
export class AddAgencyDialogComponent implements OnInit {
  agencyForm: FormGroup;
  isEditMode = false;
  governorateOptions: string[] = Object.values(Governorate);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAgencyDialogComponent>,
    private agencyService: AgencyService,
    @Inject(MAT_DIALOG_DATA) public data: { agency?: Agency }
  ) {
    this.agencyForm = this.fb.group({
      id_agency: [null],
      governorate: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@amana\\.tn$')]],
      latitude: [null],
      longitude: [null],
      user: [null] // You might need to adjust this based on how you handle user association
    });

    if (data?.agency) {
      this.isEditMode = true;
      this.patchForm(data.agency);
    }
  }

  ngOnInit(): void {}

  patchForm(agency: Agency): void {
    this.agencyForm.patchValue({
      id_agency: agency.id_agency,
      governorate: agency.governorate,
      address: agency.address,
      city: agency.city,
      phoneNumber: agency.phoneNumber,
      email: agency.email,
      latitude: agency.latitude,
      longitude: agency.longitude,
    });
  }

  submit(): void {
    if (this.agencyForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.agencyService.updateAgency(this.agencyForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.agencyService.createAgency(this.agencyForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
