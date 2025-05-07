import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AuditPageComponent } from './auditPage/audit-page.component';
import { RoleGuard } from '../authentication/guards/role.guard';
import {ProfileComponent} from "./profile/profile.component";

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
];
