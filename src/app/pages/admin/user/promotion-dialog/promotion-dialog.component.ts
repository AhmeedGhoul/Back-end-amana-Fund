import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../user.model';
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatCard} from "@angular/material/card";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-promotion-dialog',
  templateUrl: './promotion-dialog.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatLabel,
    MatCard,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    MatButton,
    MatIconButton
  ],
  styleUrls: ['./promotion-dialog.component.css']
})
export class PromotionDialogComponent {
  // Define the union type for roles
  selectedRole: 'Admin' | 'Auditor' | 'Agent' | 'User' = 'User'; // default to 'User' or any valid role
  roles: ('Admin' | 'Auditor' | 'Agent' | 'User')[] = ['Admin', 'Auditor', 'Agent', 'User'];

  // Mapping between user-friendly roles and backend roles
  roleMapping: { [key in 'Admin' | 'Auditor' | 'Agent' | 'User']: string } = {
    Admin: 'ROLE_ADMIN',
    Auditor: 'ROLE_AUDITOR',
    Agent: 'ROLE_AGENT',
    User: 'ROLE_USER'
  };

  constructor(
    public dialogRef: MatDialogRef<PromotionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  changeUserRole(action: 'promote' | 'demote'): void {
    // Map the selected role to the backend role
    const backendRole = this.roleMapping[this.selectedRole];

    // Close the dialog and pass the action with the role
    this.dialogRef.close({ action, role: backendRole });
  }
}
