import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavItem } from './nav-item';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    TablerIconsModule,
    MaterialModule
  ],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class AppNavItemComponent implements OnInit {
  @Input() item: NavItem = {
    displayName: '',
    iconName: '',
    route: '',
    children: []
  } as NavItem;
  
  @Input() depth: number = 0;
  @Input() isMobileView: boolean = false;
  @Output() linkClick = new EventEmitter<void>();
  
  expanded: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize expanded state for parent items
    if (this.hasChildren) {
      this.expanded = this.item.expanded || false;
    }
  }
  
  /**
   * Check if the item has children
   */
  get hasChildren(): boolean {
    return Array.isArray(this.item?.children) && this.item.children.length > 0;
  }
  
  /**
   * Toggle submenu expansion
   */
  toggleExpand(): void {
    if (this.hasChildren) {
      this.expanded = !this.expanded;
    }
  }


  /**
   * Handle item click event
   * @param event Mouse event
   */
  onItemClick(event: Event): void {
    // Skip processing for section headers
    if (this.item.navCap) {
      return;
    }

    if (this.hasChildren) {
      // Toggle submenu for parent items
      event.preventDefault();
      this.toggleExpand();
    } else {
      // Emit link click event for regular items
      this.linkClick.emit();
    }
    // Stop propagation to prevent multiple events
    event.stopPropagation();
  }
  
  /**
   * Track by function for ngFor
   */
  trackByFn(index: number, item: NavItem): string {
    return item.route ? (Array.isArray(item.route) ? item.route.join('/') : item.route) : `${index}`;
  }
}
