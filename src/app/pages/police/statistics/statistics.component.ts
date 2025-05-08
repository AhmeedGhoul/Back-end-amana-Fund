import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliceService } from '../../../services/police.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class StatisticsComponent implements OnInit {
  totalAmount: number = 0;
  activePercentage: number = 0;
  loading = true;
  error: string | null = null;
  policeAmount: number = 0;

  constructor(private policeService: PoliceService) {}

  ngOnInit() {
    this.fetchStatistics();
  }

  calculateBarHeight(amount: number): number {
    // Assuming maximum possible amount is 2000 for the bar height calculation
    const MAX_AMOUNT = 2000;
    const percentage = (amount / MAX_AMOUNT) * 100;
    return Math.min(percentage, 100); // Ensure we don't exceed 100%
  }

  private async fetchStatistics() {
    try {
      // Fetch active percentage
      const activePercentage$ = this.policeService.getActivePercentage();
      // Fetch total amount
      const totalAmount$ = this.policeService.getTotalActiveAmount();

      // Wait for both requests to complete
      const [percentage, amount] = await Promise.all([
        activePercentage$.toPromise(),
        totalAmount$.toPromise()
      ]);

      // Ensure values are defined
      if (percentage === undefined || amount === undefined) {
        throw new Error('Failed to fetch statistics data');
      }

      // Update component values
      this.activePercentage = percentage;
      this.totalAmount = amount;
      
      // Update the pie chart style
      const pieElement = document.querySelector('.pie') as HTMLElement;
      if (pieElement) {
        pieElement.style.setProperty('--p', this.activePercentage.toFixed(1));
      }

    } catch (error: any) {
      this.error = error.message || 'Failed to fetch statistics';
      console.error('Error fetching statistics:', error);
    } finally {
      this.loading = false;
      // Calculate police amount percentage
      this.policeAmount = this.calculateBarHeight(this.totalAmount);
    }
  }
}