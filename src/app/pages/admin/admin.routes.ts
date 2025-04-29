import { Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";
import {AuditPageComponent} from "./auditPage/audit-page.component";



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
      }
    ],
  },
];
