import { Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";
import {AuditPageComponent} from "./auditPage/audit-page.component";
import {AgencyComponent} from "./agency/agency.component";



export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'audit',
        component: AuditPageComponent,
      },
      {
        path: 'agency',
        component: AgencyComponent,
      }
    ],
  },
];
