import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AccountDashboardComponent } from './components/account-dashboard/account-dashboard.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [
    AccountDashboardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
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