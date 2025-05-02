import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss']
})
export class AccountDashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  currentYear = new Date().getFullYear();
  
  // Statistics data
  totalSales = 1111.20;
  averageCart = 123.47;
  paidOrders = 24;
  
  // Conversion data
  conversionRate = 13;
  conversionData = {
    startedCart: { visitors: 53, percentage: 100 },
    startedCheckout: { visitors: 35, percentage: 66 },
    orders: { visitors: 7, percentage: 13 }
  };

  // Device sales chart configuration
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Mobile', 'Desktop'],
    datasets: [{
      data: [33, 67],
      backgroundColor: ['#36A2EB', '#2196F3'],
      hoverBackgroundColor: ['#36A2EB', '#2196F3'],
      borderWidth: 0
    }]
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%'
  };

  constructor() {}

  ngOnInit(): void {}
} 