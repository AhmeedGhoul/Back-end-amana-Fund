import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService, PaymentStatisticsDTO } from '@app/services/account.service';
import { Chart, ChartData, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { BaseChartDirective } from 'ng2-charts';
import { format, parseISO, compareAsc, differenceInDays } from 'date-fns';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController, zoomPlugin);

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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  paymentStats: PaymentStatisticsDTO[] = [];
  statsChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Balance',
        data: [],
        fill: true,
        borderColor: '#00ff99',
        backgroundColor: 'rgba(0,255,153,0.15)',
        type: 'line' as const,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
        order: 1
      }
    ]
  };
  statsChartOptions: any;
  loading = false;
  errorMessage: string | null = null;
  private zoomLevel: number = 1;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.initChartOptions();
    if (this.rib) {
      this.fetchPaymentStatistics(this.rib);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['rib'] && this.rib) || (changes['periodType'] && this.rib)) {
      this.fetchPaymentStatistics(this.rib!);
    }
  }

  resetZoom(): void {
    if (this.chart && this.chart.chart) {
      this.chart.chart.resetZoom();
      this.zoomLevel = 1;
      if (this.periodType !== 'MONTH' && this.rib) {
        this.periodType = 'MONTH';
        this.fetchPaymentStatistics(this.rib);
      }
    }
  }

  onChartZoom({ chart }: any): void {
    if (!chart.scales['x']) return;
    
    const visibleRange = chart.scales['x'].max - chart.scales['x'].min;
    const prevPeriodType = this.periodType;
    
    // Calculate zoom level based on visible range
    this.zoomLevel = this.paymentStats.length / visibleRange;
    
    // Determine the appropriate period type based on zoom level
    if (this.zoomLevel > 5 && this.periodType === 'MONTH') {
      this.periodType = 'DAY';
    } else if (this.zoomLevel <= 5 && this.periodType === 'DAY') {
      this.periodType = 'MONTH';
    }
    
    // Only fetch new data if period type changed
    if (prevPeriodType !== this.periodType && this.rib) {
      this.fetchPaymentStatistics(this.rib);
    }
  }

  fetchPaymentStatistics(rib: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.accountService.getPaymentStatistics(rib, this.periodType).subscribe({
      next: (stats: PaymentStatisticsDTO[]) => {
        // Sort stats by date in ascending order
        this.paymentStats = stats.sort((a, b) => 
          compareAsc(parseISO(a.period), parseISO(b.period))
        );
        
        // Format labels based on periodType
        const formattedLabels = this.paymentStats.map(s => {
          const date = parseISO(s.period);
          return this.periodType === 'DAY' 
            ? format(date, 'MMM dd, yyyy')
            : format(date, 'MMM yyyy');
        });

        this.statsChartData = {
          labels: formattedLabels,
          datasets: [
            {
              label: 'Balance',
              data: this.paymentStats.map(s => s.totalAmount),
              fill: true,
              borderColor: (ctx: any) => {
                const { ctx: canvasCtx, chartArea } = ctx.chart;
                if (!chartArea) return '#00ff99';
                const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(0,255,153,0.1)');
                gradient.addColorStop(1, 'rgba(0,255,153,1)');
                return gradient;
              },
              backgroundColor: (ctx: any) => {
                const { ctx: canvasCtx, chartArea } = ctx.chart;
                if (!chartArea) return 'rgba(0,255,153,0.15)';
                const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(0,255,153,0.05)');
                gradient.addColorStop(1, 'rgba(0,255,153,0.3)');
                return gradient;
              },
              type: 'line' as const,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              borderWidth: 2,
              order: 1
            }
          ]
        };
        this.loading = false;
        this.chart?.update();
        
        // Reset zoom after data update
        setTimeout(() => {
          if (this.chart && this.chart.chart) {
            this.chart.chart.resetZoom();
          }
        }, 100);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payment statistics. Please try again.';
        this.loading = false;
      }
    });
  }

  initChartOptions(): void {
    this.statsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.1
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
            onZoom: (ctx: any) => this.onChartZoom(ctx)
          },
          pan: {
            enabled: true,
            mode: 'x',
            threshold: 10
          },
          limits: {
            x: { min: 'original', max: 'original', minRange: 3 }
          }
        },
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(25,28,36,0.9)',
          titleColor: '#00ff99',
          bodyColor: '#ffffff',
          borderColor: '#00ff99',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx: any) => `Balance: ${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`,
            title: (ctx: any) => `Period: ${ctx[0].label}`
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#b0b0b0',
            font: { size: 12 },
            maxTicksLimit: 8,
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          grid: {
            color: 'rgba(255,255,255,0.1)',
            borderDash: [5, 5],
            drawBorder: false
          },
          ticks: {
            color: '#b0b0b0',
            font: { size: 12 },
            callback: (val: number) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }
      },
      elements: {
        line: {
          borderJoinStyle: 'round',
          borderCapStyle: 'round'
        }
      },
      transitions: {
        zoom: {
          animation: {
            duration: 500,
            easing: 'easeOutCubic'
          }
        }
      }
    };
  }
}