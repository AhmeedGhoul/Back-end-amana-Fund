import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliceService } from '../../../services/police.service';
import { map } from 'rxjs/operators';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule]
})
export class StatisticsComponent implements OnInit {
  totalAmount: number = 0;
  totalAmount1: number = 0;
  activePercentage: number = 0;
  loading = true;
  error: string | null = null;
  policeAmount: number = 0;
  amountByStartDate: Map<Date, number> = new Map();
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Amount by Start Date',
      borderColor: '#004d99',
      backgroundColor: '#007bff',
      tension: 0.4,
      fill: false,
      pointBackgroundColor: '#004d99',
      pointBorderColor: '#004d99'
    }]
  };

  private updateChartData(amountByStartDate: Map<Date, number>) {
    const dates = Array.from(amountByStartDate.keys()).map(date => date.toLocaleDateString());
    const amounts = Array.from(amountByStartDate.values());
    
    this.chartData.labels = dates;
    this.chartData.datasets[0].data = amounts;
  }
  public chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#004d99'
        }
      },
      title: {
        display: true,
        text: 'Amount by Start Date',
        color: '#004d99'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#004d99'
        },
        grid: {
          color: '#007bff'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#004d99'
        },
        grid: {
          color: '#007bff'
        },
        ticks: {
          color: '#004d99',
          beginAtZero: true
        }
      }
    }
  };

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
      // Fetch active percentage and both total amounts
      const activePercentage$ = this.policeService.getActivePercentage();
      const totalAmount$ = this.policeService.getTotalActiveAmount();
      const totalAmount1$ = this.policeService.getTotalAmount();

      // Wait for all requests to complete
      const [percentage, amount, amount1, amountByDate] = await Promise.all([
        activePercentage$.toPromise(),
        totalAmount$.toPromise(),
        totalAmount1$.toPromise(),
        this.policeService.getAmountSumByStartDate().toPromise()
      ]);

      // Update amount by start date data
      this.amountByStartDate = amountByDate as Map<Date, number>;

      // Update chart data
      this.updateChartData(amountByDate as Map<Date, number>);

      // Ensure values are defined
      if (percentage === undefined || amount === undefined || amount1 === undefined) {
        throw new Error('Failed to fetch statistics data');
      }

      // Update component values
      this.activePercentage = percentage;
      this.totalAmount = amount;
      this.totalAmount1 = amount1;
      
      // Calculate police amount for bar chart
      this.policeAmount = this.calculateBarHeight(this.totalAmount);
      
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