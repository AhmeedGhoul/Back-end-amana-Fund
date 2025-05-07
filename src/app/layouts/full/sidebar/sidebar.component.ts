import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import { navItems } from './sidebar-data';
import { AuthService } from '../../../pages/authentication/side-login/login-choice/auth.service';
import {NavItem} from "./nav-item/nav-item";
import {AppNavItemComponent} from "./nav-item/nav-item.component";
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TablerIconsModule, MaterialModule, RouterModule, BrandingComponent, NgIf, AppNavItemComponent, NgForOf],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  navItems = navItems;
  rolesReady = false;
  filteredNavItems: NavItem[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      const roles = this.authService.getCurrentUser()?.roles || [];
      const normalizedRoles = roles.map(r => r.replace('ROLE_', ''));
      this.filteredNavItems = navItems.filter(item => {
        return !item.roles || item.roles.some(role => normalizedRoles.includes(role));
      });
      this.rolesReady = true;
    }, 50);
  }
}
