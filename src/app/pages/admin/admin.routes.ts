import { Routes } from '@angular/router';
import { UserComponent } from "./user/user.component";
import { AuditPageComponent } from "./auditPage/audit-page.component";
import { PaymentComponent } from "./payment/payment.component";
import { ContractComponent } from "./contract/ContractComponent";
import { CreditPoolComponent } from "./credit-pool/CreditPoolComponent";

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserComponent,
    data: { title: 'Users' }
  },
  {
    path: 'audit',
    component: AuditPageComponent,
    data: { title: 'Audit' }
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
  }
];
