import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountService } from '../../../../../services/account.service';
import { User } from '../../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

interface AccountResponse {
  id: number;
  rib: string;
  [key: string]: any;
}

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
    MatSnackBarModule
  ],
  templateUrl: './add-account-dialog.component.html',
  styleUrls: ['./add-account-dialog.component.scss']
})
export class AddAccountDialogComponent implements OnInit {
  accountForm: FormGroup;
  users: User[] = [];
  accountTypes = ['Epargne', 'Epargne Zeket'];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private dialogRef: MatDialogRef<AddAccountDialogComponent>
  ) {
    this.accountForm = this.fb.group({
      userId: ['', Validators.required],
      accountType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      interestRate: new FormControl({ value: '', disabled: true }),
      rib: new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.setupAccountTypeListener();
  }

  private loadUsers(): void {
    this.accountService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
      }
    });
  }

  private setupAccountTypeListener(): void {
    this.accountForm.get('accountType')?.valueChanges.subscribe(type => {
      const interestRate = type === 'Epargne' ? 3 : 5;
      this.accountForm.patchValue({ interestRate });
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const formData = this.accountForm.getRawValue();
      this.accountService.createAccount(formData).subscribe({
        next: (response: AccountResponse) => {
          this.dialogRef.close(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating account:', error);
        }
      });
    }
  }
} 