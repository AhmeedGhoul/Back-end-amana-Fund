import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountDashboardComponent } from './components/account-dashboard/account-dashboard.component';
import { RIBHelpDialogComponent } from '../admin/account-page/account-details/rib-help-dialog.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [
    RIBHelpDialogComponent,
    AccountDashboardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatDialogModule,
    BaseChartDirective,
    RouterModule.forChild([
      {
        path: '',
        component: AccountDashboardComponent
      }
    ])
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class AccountModule { } 