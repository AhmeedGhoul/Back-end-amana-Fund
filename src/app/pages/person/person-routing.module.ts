import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonComponent } from './person.component';
import { ObjectComponent } from '../object/object.component';
import { AuthGuard } from '../authentication/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PersonComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'object',
    component: ObjectComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
