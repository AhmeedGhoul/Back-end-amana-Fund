import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavItem } from './nav-item/nav-item';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { BrandingComponent } from './branding.component';
import { navItems } from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    TablerIconsModule,
    MaterialModule,
    AppNavItemComponent,
    BrandingComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isMobileView: boolean = false;
  @Input() isCollapsed: boolean = false;
  
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() linkClicked = new EventEmitter<void>();
  
  navItems: NavItem[] = [];
  
  constructor() {
    // Initialize with empty array to ensure it's always defined
    this.navItems = [];
  }
  
  ngOnInit() {
    // Make sure to handle potential undefined navItems
    if (navItems && Array.isArray(navItems)) {
      this.navItems = [...navItems];
    }
  }
  
  /**
   * Handle navigation item click
   * Emits the linkClicked event and closes the mobile menu if needed
   */
  onNavItemClick(): void {
    this.linkClicked.emit();
    
    // Close mobile menu after navigation
    if (this.isMobileView) {
      this.toggleMobileNav.emit();
    }
  }
  
  trackByFn(index: number, item: NavItem): string | number {
    if (item.route) {
      return Array.isArray(item.route) ? item.route.join('/') : item.route;
    }
    return index;
  }
}
