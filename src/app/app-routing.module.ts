import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './pages/authentication/guards/auth.guard';

const routes: Routes = [
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
        canActivate: [AuthGuard],
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then(
            (m) => m.UiComponentsRoutes
          ),
        canActivate: [AuthGuard],
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
    redirectTo: '/authentication/error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
