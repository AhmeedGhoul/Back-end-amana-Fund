import { Routes } from '@angular/router';

import {TwoFactorAuthComponent} from "./two-factor-auth/two-factor-auth.component";
import {ForgotPasswordComponent} from "./side-login/login-choice/forget-password/forget-password.component";
import {ResetPasswordComponent} from "./side-login/login-choice/reset-password/reset-password.component";
import {LoginChoiceComponent} from "./side-login/login-choice/login-choice.component";
import {LoginFaceComponent} from "./side-login/login-choice/login-face/login-face.component";
import {LoginNormalComponent} from "./side-login/login-choice/login-normal/login-normal.component";

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginChoiceComponent,
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
      {
        path: 'login-normal',
        component: LoginNormalComponent,
      },
      {
        path: 'login-face',
        component: LoginFaceComponent,
      }
    ],
  },
];
