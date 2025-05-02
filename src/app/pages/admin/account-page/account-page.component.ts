import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AccountDetailsComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent {}
