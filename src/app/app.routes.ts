import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './pages/authentication/guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { VisitorComponent } from './pages/visitor/visitor.component';
import { DefaultRedirectComponent } from './pages/default-redirect-component/default-redirect-component.component';
import { SinistresComponent } from './sinistres/sinistres.component';
import { ContractComponent } from './contract/contract.component';

export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '', // 👈 root path
        component: VisitorComponent, // 👈 shown at '/'
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then((m) => m.AuthenticationRoutes),
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
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
        canActivate: [AuthGuard],
      },
      {
        path: 'sinistres',
        component: SinistresComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'contracts',
        component: ContractComponent,
        canActivate: [AuthGuard],
      },

    ],
  }, {
    path: 'police',
    loadChildren: () =>
      import('./pages/police/police-routing.module').then(
        (m) => m.PoliceRoutingModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: 'not-found',
  },
];
