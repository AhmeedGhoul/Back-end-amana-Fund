import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AuditPageComponent } from './auditPage/audit-page.component';
import { RoleGuard } from '../authentication/guards/role.guard';
import {ProfileComponent} from "./profile/profile.component";
import {AgencyComponent} from "./agency/agency/agency.component";
import {AgencyPageComponent} from "./agency/agency-page.component";
import { AccountPageComponent } from './account-page/account-page.component';
import { AccountDetailsComponent } from './account-page/account-details/account-details.component';
import { AccountPaymentsComponent } from './account-page/account-payments/account-payments.component';
import { AccountFullDetailsComponent } from './account-page/account-details/account-full-details/account-full-details.component';
import {PoliceComponent} from "../police/police.component";
import {PoliceaddComponent} from "../police/add/policeadd.component";
import { PaymentComponent } from "./payment/payment.component";
import { ContractComponent } from "./contract/ContractComponent";
import { CreditPoolComponent } from "./credit-pool/CreditPoolComponent";


export const AdminRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'audit',
    component: AuditPageComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'AUDITOR' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'accounts/details/:rib',
    component: AccountFullDetailsComponent
  },
  {
    path: 'agency',
    component: AgencyPageComponent,
  },
  {
    path: 'account',
    component: AccountPageComponent
  },
  {
    path: 'payments',
    component: AccountPaymentsComponent
  },
  {
    path: 'payment',
    component: PaymentComponent,
    data: { title: 'Payments' }
  },
  {
    path: 'contract',
    component: ContractComponent,
    data: { title: 'Contracts' }
  },
  {
    path: 'credit-pool',
    component: CreditPoolComponent,
    data: { title: 'Credit Pools' }
  },
  {
    path: 'police',
    component: PoliceComponent,
    children: [
      {
        path: 'add',
        component: PoliceaddComponent
      }
    ]
  }
];
