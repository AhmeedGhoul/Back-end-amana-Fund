import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseChartDirective } from 'ng2-charts';

import { AccountFullDetailsComponent } from './account-full-details/account-full-details.component';
import { AccountPaymentDialogComponent } from './account-payment-dialog/account-payment-dialog.component';
import { AccountDetailsComponent } from './account-details.component';
import { ThreeDCardComponent } from '@app/components/three-dcard/three-dcard.component';
import { CreditCardAnimationComponent } from '@app/credit-card-animation/credit-card-animation.component';
@NgModule({
  declarations: [
    
  ],
  imports: [
    AccountDetailsComponent,
    CreditCardAnimationComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BaseChartDirective,
    ThreeDCardComponent
  ],
  exports: [
    AccountDetailsComponent,
    ThreeDCardComponent,
    CreditCardAnimationComponent
  ]
})
export class AccountDetailsModule { }