import { Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";



export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        component: UserComponent,
      }
    ],
  },
];
