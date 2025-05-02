import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './pages/authentication/guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {DefaultRedirectComponent} from "./pages/default-redirect-component/default-redirect-component.component";

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        component: DefaultRedirectComponent // no redirectTo here
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [AuthGuard],
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then((m) => m.AdminRoutes),
        canActivate: [AuthGuard], // only logged in
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then((m) => m.AuthenticationRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
