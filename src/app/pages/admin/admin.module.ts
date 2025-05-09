import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UiComponentsRoutes } from './admin.routes';
import { UserComponent } from './user/user.component';
import { AuditPageComponent } from './auditPage/audit-page.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  imports: [
    RouterModule.forChild(UiComponentsRoutes),
    UserComponent,
    AuditPageComponent,
    PaymentComponent
  ]
})
export class AdminModule { }
