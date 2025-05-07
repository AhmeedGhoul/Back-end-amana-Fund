import { Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";
import {AuditPageComponent} from "./auditPage/audit-page.component";
import {PoliceComponent} from "../police/police.component";
import {PoliceaddComponent} from "../police/add/policeadd.component";

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
        path: 'police',
        component: PoliceComponent,
        children: [
          {
            path: 'add',
            component: PoliceaddComponent
          }
        ]
      }
    ],
  },
];
