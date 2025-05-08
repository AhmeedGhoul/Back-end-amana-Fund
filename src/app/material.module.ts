import { NgModule } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { CommonModule } from '@angular/common';
// Material Form Controls
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
// Material Popups & Modals
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AuditComponent } from './pages/admin/auditPage/audit/audit.component';
import { AddAuditDialogComponent } from './pages/admin/auditPage/audit/add-audit-dialog/add-audit-dialog.component';
import { ActivityLogComponent } from './pages/admin/auditPage/activity-log/activity-log.component';
import { FraudCaseComponent } from './pages/admin/auditPage/fraud-case/fraud-case.component';
import { AddFraudCaseDialogComponent } from './pages/admin/auditPage/fraud-case/add-fraud-case-dialog/add-fraud-case-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RecaptchaModule} from "ng-recaptcha";
import { AuditDetailsComponent } from './pages/admin/auditPage/audit/audit-details/audit-details.component';
import { VisitorComponent } from './pages/visitor/visitor.component';
import {RouterLink} from "@angular/router";
import { RequestComponent } from './pages/admin/agency/request/request.component';
import { AddRequestDialogComponent } from './pages/admin/agency/request/add-request-dialog/add-request-dialog.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
@NgModule({
  declarations: [
    NotFoundComponent
  ],
  exports: [
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RecaptchaModule,
    DatePipe,
    RouterLink
  ]
})
export class MaterialModule {}
