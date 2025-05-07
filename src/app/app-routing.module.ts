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
        component: PoliceComponent,
        children: [
          {
            path: 'add',
            component: PoliceaddComponent
          }
        ]
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
