import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliceComponent } from './pages/police/police.component';
import { PoliceaddComponent } from './pages/police/add/policeadd.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'police',
        loadChildren: () => import('./pages/police/police-routing.module').then(m => m.PoliceRoutingModule)
      }
    ]
  },
  { path: '', redirectTo: '/admin/police', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/police' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
