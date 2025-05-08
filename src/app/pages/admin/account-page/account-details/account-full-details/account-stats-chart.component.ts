import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService, PaymentStatisticsDTO } from '@app/services/account.service';
import { Chart, ChartType, ChartData, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, PointElement, LineElement, BarController } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, PointElement, LineElement, BarController);

@Component({
  selector: 'app-account-stats-chart',
  templateUrl: './account-stats-chart.component.html',
  styleUrls: ['./account-stats-chart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    BaseChartDirective
  ]
})
export class AccountStatsChartComponent implements OnInit, OnChanges {
  @Input() rib: string | undefined;
  @Input() periodType: string = 'MONTH';

  paymentStats: PaymentStatisticsDTO[] = [];
  statsChartData: ChartData<'bar' | 'line'> = { labels: [], datasets: [] };
  statsChartOptions: any;
  loading = true;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.initChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['rib'] && this.rib) || (changes['periodType'] && this.rib)) {
      this.fetchPaymentStatistics(this.rib!);
    }
  }

  fetchPaymentStatistics(rib: string): void {
    this.loading = true;
    this.accountService.getPaymentStatistics(rib, this.periodType).subscribe({
      next: (stats: PaymentStatisticsDTO[]) => {
        this.paymentStats = stats;
        this.statsChartData = {
          labels: stats.map(s => s.period),
          datasets: [
            {
              label: 'Balance',
              data: stats.map(s => s.totalAmount),
              fill: true,
              borderColor: (ctx: any) => {
                const chart = ctx.chart;
                const {ctx: canvasCtx, chartArea} = chart;
                if (!chartArea) return '#00ff99';
                const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(0,255,153,0.1)');
                gradient.addColorStop(1, 'rgba(0,255,153,1)');
                return gradient;
              },
              backgroundColor: (ctx: any) => {
                const chart = ctx.chart;
                const {ctx: canvasCtx, chartArea} = chart;
                if (!chartArea) return 'rgba(0,0,0,0.8)';
                const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(0,255,153,0.05)');
                gradient.addColorStop(1, 'rgba(0,255,153,0.15)');
                return gradient;
              },
              type: 'line' as const,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 6,
              borderWidth: 3,
              order: 1
            }
          ]
        };

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  initChartOptions(): void {
    this.statsChartOptions = {
      responsive: true,
      animation: {
        duration: 900,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: '#191c24',
          titleColor: '#00ff99',
          bodyColor: '#fff',
          borderColor: '#00ff99',
          borderWidth: 1,
          padding: 14,
          callbacks: {
            label: (ctx: any) => `Balance: ${ctx.parsed.y?.toLocaleString()} TND`,
            title: (ctx: any) => `Date: ${ctx[0].label}`
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#b0b0b0',
            font: { size: 13 }
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0,255,153,0.07)',
            borderDash: [2, 4],
            drawBorder: false
          },
          ticks: {
            color: '#b0b0b0',
            font: { size: 13 },
            callback: (val: number) => val.toLocaleString()
          }
        }
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 16,
          bottom: 0
        }
      },
      elements: {
        line: {
          borderJoinStyle: 'round',
          borderCapStyle: 'round'
        }
      }
    };
  }
}
