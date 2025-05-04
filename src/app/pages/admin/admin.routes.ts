import { Routes } from '@angular/router';
import { UserComponent } from "./user/user.component";
import { AuditPageComponent } from "./auditPage/audit-page.component";
import { AccountPageComponent } from './account-page/account-page.component';
import { AccountDetailsComponent } from './account-page/account-details/account-details.component';
import { AccountPaymentsComponent } from './account-page/account-payments/account-payments.component';
import { AccountFullDetailsComponent } from './account-page/account-details/account-full-details/account-full-details.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'accounts/details/:rib',
        component: AccountFullDetailsComponent
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'audit',
        component: AuditPageComponent,
      },
      {
        path: 'account',
        component: AccountPageComponent
      },
      {
        path: 'payments',
        component: AccountPaymentsComponent
      }
    ],
  }
];
