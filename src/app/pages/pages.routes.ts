import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import {AuthGuard} from "./authentication/guards/auth.guard";

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Starter' },

      ],

    },
  },
];
