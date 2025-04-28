import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import {TwoFactorAuthComponent} from "./two-factor-auth/two-factor-auth.component";
import {ForgotPasswordComponent} from "./side-login/forget-password/forget-password.component";
import {ResetPasswordComponent} from "./side-login/reset-password/reset-password.component";

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: '2fa',
        component: TwoFactorAuthComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
    ],
  },
];
