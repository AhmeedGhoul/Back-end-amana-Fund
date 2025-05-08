import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import {AuthGuard} from "./pages/authentication/guards/auth.guard";
import {BlankComponent} from "./layouts/blank/blank.component";

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [AuthGuard],      // Guard attached here (this triggers it!)

      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then(
            (m) => m.UiComponentsRoutes

          ),
        canActivate: [AuthGuard],      // Guard attached here (this triggers it!)

      },
      {
        path: 'police',
        loadChildren: () =>
          import('./pages/police/police-routing.module').then(
            (m) => m.PoliceRoutingModule
          ),
        canActivate: [AuthGuard],
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
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
