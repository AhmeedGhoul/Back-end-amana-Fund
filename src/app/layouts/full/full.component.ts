import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';

// Components
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from '../../pages/loader/loader.component';

// Services
import { NavService } from '../../services/nav.service';

// Constants
const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';


@Component({
  selector: 'app-full',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    
    // App Components
    SidebarComponent,
    HeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FullComponent implements OnInit, OnDestroy {
  // Dependencies
  private breakpointObserver = inject(BreakpointObserver);
  private mediaMatcher = inject(MediaMatcher);
  private navService = inject(NavService);

  // View Children
  @ViewChild('leftsidenav') public sidenav!: MatSidenav;
  @ViewChild('sidenavContent') public sidenavContent!: MatSidenavContent;
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  // State
  isMobileView = false;
  isCollapsed = false;
  private layoutChangesSubscription: Subscription = Subscription.EMPTY;
  private mediaQueryListener: () => void;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  
  // Media query for mobile detection
  private mobileQuery: MediaQueryList;
  private htmlElement: HTMLElement;
  private _isOver = false;

  get isOver(): boolean {
    return this._isOver;
  }
  
  set isOver(value: boolean) {
    this._isOver = value;
  }

  constructor() {
    this.htmlElement = document.documentElement;
    this.htmlElement.classList.add('light-theme');
    
    // Initialize mobile detection
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 768px)');
    this.isMobileView = this.mobileQuery.matches;
    
    // Set up media query listener for mobile detection
    this.mediaQueryListener = () => {
      this.isMobileView = this.mobileQuery.matches;
      this.updateSidebarState();
    };
    
    // Add event listener for media query changes
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this.mediaQueryListener);
    } else {
      // For older browsers
      this.mobileQuery.addListener(this.mediaQueryListener);
    }
    
    // Subscribe to layout changes for responsive behavior
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .subscribe((state) => {
        // Update sidebar state based on viewport size
        if (state.breakpoints[MOBILE_VIEW]) {
          this.isMobileView = true;
          this.isOver = true;
        } else if (state.breakpoints[TABLET_VIEW]) {
          this.isMobileView = false;
          this.isOver = false;
          this.isCollapsed = false;
        } else if (state.breakpoints[MONITOR_VIEW]) {
          this.isMobileView = false;
          this.isOver = false;
        }
        
        // Update the sidebar state
        this.updateSidebarState();
      });
  }

  ngOnInit(): void {
    // Initialize sidebar state
    this.updateSidebarState();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and event listeners
    this.layoutChangesSubscription.unsubscribe();
    
    // Remove media query listener
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener('change', this.mediaQueryListener);
    } else {
      // For older browsers
      this.mobileQuery.removeListener(this.mediaQueryListener);
    }
  }

  /**
   * Toggles the collapsed state of the sidebar
   */
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.navService.collapseSidebar = this.isCollapsed;
    this.updateSidebarState();
  }
  
  /**
   * Tracks items in ngFor
   */
  trackItem(index: number, item: any): string {
    return item.id || index.toString();
  }

  /**
   * Handles the start of the sidebar close animation
   */
  onSidenavClosedStart(): void {
    if (this.isMobileView) {
      this.isOver = true;
    }
  }
  
  /**
   * Handles sidebar opened state changes
   */
  onSidenavOpenedChange(isOpened: boolean): void {
    if (!this.isMobileView) {
      this.isCollapsed = !isOpened;
      this.navService.collapseSidebar = this.isCollapsed;
    }
  }
  
  /**
   * Updates the sidebar state based on current viewport and settings
   */
  private updateSidebarState(): void {
    if (!this.sidenav) return;
    
    if (this.isMobileView) {
      // In mobile view, sidebar is always hidden by default
      this.sidenav.close();
      // Use type assertion to bypass the type checking for mode
      (this.sidenav as any).mode = 'over';
      this._isOver = true;
    } else {
      // In desktop view, toggle between collapsed and expanded states
      (this.sidenav as any).mode = 'side';
      this.sidenav.opened = !this.isCollapsed;
      this._isOver = false;
    }
    
    // Update the navigation service
    this.navService.setSidebarCollapsed(this.isCollapsed);
  }
  
  // Handle link clicks in mobile view
  onLinkClick(): void {
    if (this.isMobileView) {
      this.sidenav.close();
    }
  }
}
