import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts'; // Import ChartComponent
import { Observable } from 'rxjs';
import { AuditService } from '../admin/auditPage/audit/audit.service';
import { ActivityLogService } from '../admin/auditPage/activity-log/activity-log.service';
import { FraudCaseService } from '../admin/auditPage/fraud-case/fraud-case.service';
import { MaterialModule } from '../../material.module';

// Import ApexCharts types
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';  // Correct import for types

// Define Enum for Case Types
export enum CaseType {
  RISK = 'RISK',
  FINANCIAL = 'FINANCIAL',
  COMPLIANCE = 'COMPLIANCE',
  CORRUPTION = 'CORRUPTION'
}

// Define the type of fraudCasesByType
interface FraudCasesByType {
  [CaseType.RISK]: number;
  [CaseType.FINANCIAL]: number;
  [CaseType.COMPLIANCE]: number;
  [CaseType.CORRUPTION]: number;
}

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries; // Ensuring series is not undefined
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css'],
  standalone: true,
  imports: [
    MaterialModule,
    NgApexchartsModule,  // Import ng-apexcharts module to render charts
  ],
})
export class StarterComponent implements OnInit {
  // Declare ViewChild for each chart
  @ViewChild('fraudCasesChart') fraudCasesChart: ChartComponent;
  @ViewChild('auditsChart') auditsChart: ChartComponent;
  @ViewChild('activityLogChart') activityLogChart: ChartComponent;

  // Initialize chartOptions with default values to avoid undefined errors
  public fraudCasesChartOptions: ChartOptions = {
    series: [0, 0, 0, 0], // Default empty data for donut chart
    chart: {
      height: 350,
      type: 'donut',  // Changed to donut chart type
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 0,  // No stroke for a donut chart
    },
    title: {
      text: 'Fraud Cases Distribution',
      align: 'center',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [CaseType.RISK, CaseType.FINANCIAL, CaseType.COMPLIANCE, CaseType.CORRUPTION]
    },
  };

  public auditsChartOptions: ChartOptions = {
    series: [{ name: 'Total Audits', data: [0] }], // Default empty data
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Audits Data',
      align: 'center',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: ['Audit Data'],
    },
  };

  // Activity Log Chart: Using a bar chart to represent activity log data
  public activityLogChartOptions: ChartOptions = {
    series: [{ name: 'Activity Count', data: [] }], // Default empty data
    chart: {
      height: 350,
      type: 'bar',  // Changed to bar chart
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Activity Log Data',
      align: 'center',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [],  // This will be updated with activity names
    },
  };

  fraudCasesByType: FraudCasesByType = {
    [CaseType.RISK]: 0,
    [CaseType.FINANCIAL]: 0,
    [CaseType.COMPLIANCE]: 0,
    [CaseType.CORRUPTION]: 0,
  };

  totalFraudCases: number = 0;
  totalAudits: number = 0;
  auditsWithFraudCases: number = 0;
  mostCommonActivity: any = {};

  constructor(
    private auditService: AuditService,
    private activityLogService: ActivityLogService,
    private fraudCaseService: FraudCaseService
  ) {}

  ngOnInit(): void {
    // Fetching data via API services
    this.fraudCaseService.getTotalFraudCases().subscribe((data) => {
      this.totalFraudCases = data;
      this.updateFraudCasesChart();
    });

    this.fraudCaseService.getFraudCasesByType().subscribe((data) => {
      this.fraudCasesByType = data;
      this.updateFraudCasesChart();
    });

    this.auditService.getTotalAudits().subscribe((data) => {
      this.totalAudits = data;
      this.updateAuditsChart();
    });

    this.auditService.getAuditsWithFraudCases().subscribe((data) => {
      this.auditsWithFraudCases = data;
      this.updateAuditsChart();
    });

    this.activityLogService.getMostCommonActivity().subscribe((data) => {
      this.mostCommonActivity = data;
      this.updateActivityLogChart();
    });
  }

  // Helper function to check and handle NaN values
  handleNaN(value: any): number {
    return isNaN(value) ? 0 : value;
  }

  // Update Fraud Cases Chart data
  updateFraudCasesChart(): void {
    this.fraudCasesChartOptions = {
      ...this.fraudCasesChartOptions,  // Preserve previous settings
      series: [
        this.handleNaN(this.fraudCasesByType[CaseType.RISK]),
        this.handleNaN(this.fraudCasesByType[CaseType.FINANCIAL]),
        this.handleNaN(this.fraudCasesByType[CaseType.COMPLIANCE]),
        this.handleNaN(this.fraudCasesByType[CaseType.CORRUPTION]),
      ],
    };
  }

  // Update Audits Chart data
  updateAuditsChart(): void {
    this.auditsChartOptions = {
      ...this.auditsChartOptions,  // Preserve previous settings
      series: [
        {
          name: 'Total Audits',
          data: [this.handleNaN(this.totalAudits)],
        },
        {
          name: 'Audits with Fraud Cases',
          data: [this.handleNaN(this.auditsWithFraudCases)],
        },
      ],
      xaxis: {
        categories: ['Audit Data'],
      },
    };
  }

  // Update Activity Log Chart data
  updateActivityLogChart(): void {
    // Ensure activity log data is valid and typed correctly
    const activityNames: string[] = Object.keys(this.mostCommonActivity);
    const activityCounts: number[] = Object.values(this.mostCommonActivity);

    this.activityLogChartOptions = {
      ...this.activityLogChartOptions,  // Preserve previous settings
      series: [
        {
          name: 'Activity Count',
          data: activityCounts,  // Ensure activityCounts is of type number[]
        },
      ],
      xaxis: {
        categories: activityNames,  // Use activity names as x-axis labels
      },
    };
  }
}
