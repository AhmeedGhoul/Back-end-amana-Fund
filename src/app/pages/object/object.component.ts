import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObjectG, TypeObject, getTypeObjectValues, PoliceOption } from './object.model';
import { ObjectService } from '../../services/object.service';
import { PoliceService } from '../../services/police.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    RouterModule
  ]
})
export class ObjectComponent implements OnInit {
  objectForm: FormGroup;
  isEditing = false;
  editObjectId: number | undefined;
  dataSource: ObjectG[] = [];
  displayedColumns: string[] = ['ownershipCertifNumber', 'estimatedValue', 'type', 'documents', 'active', 'actions'];
  loading = false;
  typeObjectValues = getTypeObjectValues();
  policeOptions: PoliceOption[] = [];
  selectedPoliceId: number | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private objectService: ObjectService,
    private policeService: PoliceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadPoliceOptions();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadObjects();
  }

  loadPoliceOptions(): void {
    this.policeService.getAllPolice().subscribe({
      next: (polices: any[]) => {
        this.policeOptions = polices.map((police: any) => ({
          idPolice: police.idPolice,
          amount: police.amount,
          displayText: `${police.idPolice} - ${police.amount} MAD`
        }));
      },
      error: (error: any) => {
        console.error('Error loading police options:', error);
      }
    });
  }

  initializeForm(): void {
    this.objectForm = this.formBuilder.group({
      ownershipCertifNumber: ['', Validators.required],
      estimatedValue: ['', [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      documents: ['', Validators.required],
      policeId: ['', Validators.required]
    });
  }

  loadObjects(): void {
    this.loading = true;
    this.objectService.getAllObjects().subscribe({
      next: (objects) => {
        this.dataSource = objects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading objects:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.objectForm.valid) {
      const object: ObjectG = {
        active: true,
        policeId: this.objectForm.get('policeId')?.value,
        ...this.objectForm.value
      };

      if (this.isEditing) {
        object.idGarantie = this.editObjectId as number;
        this.updateObject(object);
      } else {
        this.addObject(object);
      }
    }
  }

  addObject(object: ObjectG): void {
    this.loading = true;
    this.objectService.addObject(object).subscribe({
      next: (response) => {
        this.dataSource.push(response);
        this.resetForm();
        this.loading = false;
        this.snackBar.open('Object added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error adding object:', error);
        this.loading = false;
        this.snackBar.open('Error adding object', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateObject(object: ObjectG): void {
    this.objectService.updateObject(object).subscribe({
      next: (updatedObject) => {
        const index = this.dataSource.findIndex(obj => obj.idGarantie === updatedObject.idGarantie);
        if (index !== -1) {
          this.dataSource[index] = updatedObject;
        }
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating object:', error);
      }
    });
  }

  editObject(object: ObjectG): void {
    this.isEditing = true;
    this.editObjectId = object.idGarantie;
    this.objectForm.patchValue({
      ownershipCertifNumber: object.ownershipCertifNumber,
      estimatedValue: object.estimatedValue,
      type: object.type,
      documents: object.documents
    });
  }

  deactivateObject(object: ObjectG): void {
    if (confirm('Are you sure you want to deactivate this object?')) {
      this.loading = true;
      this.objectService.deactivateObject(object.idGarantie!).subscribe({
        next: (updatedObject) => {
          const index = this.dataSource.findIndex(obj => obj.idGarantie === object.idGarantie);
          if (index !== -1) {
            this.dataSource[index] = updatedObject;
          }
          this.loading = false;
          this.snackBar.open('Object deactivated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deactivating object:', error);
          this.loading = false;
          this.snackBar.open('Error deactivating object', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteObject(id: number): void {
    if (confirm('Are you sure you want to delete this object?')) {
      this.loading = true;
      this.objectService.deleteObject(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(obj => obj.idGarantie !== id);
          this.loading = false;
          this.snackBar.open('Object deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deleting object:', error);
          this.loading = false;
          this.snackBar.open('Error deleting object', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.editObjectId = undefined;
    this.objectForm.reset();
  }
}
