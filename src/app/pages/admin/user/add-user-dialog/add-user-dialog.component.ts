import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // ✅ FIXED HERE

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+216\d{8}$/)]],
      age: [18, [Validators.required, Validators.min(18), Validators.max(150)]],
      address: ['', Validators.required],
      civilStatus: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });

    if (data?.user) {
      this.isEditMode = true;
      this.userForm.patchValue(data.user);
    }
  }

  ngOnInit(): void {}

  submit() {
    if (this.userForm.valid) {
      const userPayload = { ...this.userForm.value };
      if (this.isEditMode) {
        this.userService.editUser(userPayload).subscribe(() => {
          this.dialogRef.close(true);
        }, error => {
          console.error("Edit error:", error);
        });
      } else {
        this.userService.registerUser(userPayload).subscribe(() => {
          this.dialogRef.close(true);
        }, error => {
          console.error("Registration error:", error);
        });
      }
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
