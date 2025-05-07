import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliceComponent } from './police.component';
import { PoliceaddComponent } from './add/policeadd.component';

const routes: Routes = [
  {
    path: '',
    component: PoliceComponent,
    children: [
      {
        path: 'add',
        component: PoliceaddComponent
      },
      {
        path: 'edit/:id',
        component: PoliceaddComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliceRoutingModule { }
