import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./pages/authentication/two-factor-auth/auth.interceptor";
import {MaterialModule} from "./material.module";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,  // For routing
    HttpClientModule, // For HTTP requests
    MaterialModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule// For Material UI (if needed)
  ],
  templateUrl: './app.component.html',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,  // Add interceptor
      multi: true,
    },
  ],
})
export class AppComponent {
  title = 'Modernize Angular Admin Template';
}
