import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import {VisitorComponent} from "./visitor/visitor.component";

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Dashboard',
    },
  },
];
