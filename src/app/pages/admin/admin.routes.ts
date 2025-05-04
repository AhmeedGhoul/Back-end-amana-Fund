import { Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";
import {AuditPageComponent} from "./auditPage/audit-page.component";
import {AgencyComponent} from "./agency/agency/agency.component";
import {AgencyPageComponent} from "./agency/agency-page.component";



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
        component: AgencyPageComponent,
      }
    ],
  },
];
