import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { Account } from '@app/models/account.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-full-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatCardModule, 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './account-full-details.component.html',
  styleUrls: ['./account-full-details.component.scss']
})
export class AccountFullDetailsComponent implements OnInit {
  account: Account | null = null;
  loading = true;
  displayedColumns: string[] = [
    'attribute', 
    'value'
  ];
  accountDetails: { attribute: string, value: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const ribParam = this.route.snapshot.paramMap.get('rib');
    if (ribParam) {
      this.fetchAccountDetails(ribParam);
    }
  }

  fetchAccountDetails(rib: string): void {
    this.accountService.filterAccountsByRib(rib).subscribe({
      next: (accounts) => {
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.prepareAccountDetails();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching account details:', error);
        this.loading = false;
      }
    });
  }

  prepareAccountDetails(): void {
    if (!this.account) return;

    console.log('Full Account Details:', JSON.stringify(this.account, null, 2));

    this.accountDetails = [
      { attribute: 'RIB', value: this.account.rib || 'N/A' },
      { attribute: 'Account Type', value: this.account.accountType || 'N/A' },
      { attribute: 'Amount', value: this.account.amount ? `${this.account.amount} TND` : 'N/A' },
      { attribute: 'Opening Date', value: this.account.date_Opening ? new Date(this.account.date_Opening).toLocaleString() : 'N/A' },
      { attribute: 'Client Email', value: this.account.clientEmail || 'N/A' },
      { attribute: 'Interest Rate', value: this.account.interestRate ? `${this.account.interestRate * 100}%` : 'N/A' }
    ];
  }
}
