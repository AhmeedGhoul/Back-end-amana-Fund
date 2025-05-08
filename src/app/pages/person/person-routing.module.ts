import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonComponent } from './person.component';
import { ObjectComponent } from '../object/object.component';
import { PersonListComponent } from './person-list/person-list.component';
import { AuthGuard } from '../authentication/guards/auth.guard';

const routes: Routes = [
  {
    path: 'add',
    component: PersonComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    component: PersonListComponent,
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
