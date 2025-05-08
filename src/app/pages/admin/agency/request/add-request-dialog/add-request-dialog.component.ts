import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { RequestService } from '../request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Request,Product } from '../request.model';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf} from "@angular/common";  // Correct model name to Request

@Component({
  selector: 'app-add-request-dialog',
  templateUrl: './add-request-dialog.component.html',
  styleUrls: ['./add-request-dialog.component.css'],
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgForOf
  ],
  standalone: true
})
export class AddRequestDialogComponent {
  requestForm: FormGroup;  // Form to capture request details
  products = Object.values(Product);  // Get the enum values

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRequestDialogComponent>,
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize form with validations
    this.requestForm = this.fb.group({
      date_Request: [null, Validators.required],  // The request date
      document: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],  // Document description
      product: [null, Validators.required],  // Enum field
    });
  }

  // Close the dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Handle form submission
  submit(): void {
    if (this.requestForm.valid) {
      const newRequest: Request = this.requestForm.value;  // Get form values as the request object
      this.requestService.createRequest(newRequest).subscribe(
        (res) => {
          this.snackBar.open('Request added successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(res);  // Close dialog with the new request object
        },
        (err) => {
          this.snackBar.open('Failed to add request', 'Close', { duration: 3000 });
          console.error(err);
        }
      );
    }
  }
}
