import { AuthService } from '../../../pages/authentication/side-login/auth.service'; // Adjust the path to your AuthService

import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .topbar {
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 0 1rem;
    }

    .mat-icon-button {
      margin: 0 0.5rem;
    }

    .mat-menu-panel {
      width: 240px;
    }

    .mat-menu-item {
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mat-stroked-button {
      width: 100%;
      margin: 0.5rem;
    }
  `]
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Clear token
    this.router.navigate(['/authentication/login']); // Redirect to login page
  }

}

