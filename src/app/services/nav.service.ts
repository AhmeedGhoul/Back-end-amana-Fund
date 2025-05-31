import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavService {
    // Current URL state
    public currentUrl = new BehaviorSubject<string | undefined>(undefined);
    
    // Sidebar state
    public isSidebarCollapsed = false;
    public sidebarState = new BehaviorSubject<boolean>(false);

    constructor(private router: Router) {
        // Track route changes
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.currentUrl.next(event.urlAfterRedirects);
            }
        });
    }

    /**
     * Toggles the collapsed state of the sidebar
     */
    public toggleSidebar(): void {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        this.sidebarState.next(this.isSidebarCollapsed);
    }

    /**
     * Sets the collapsed state of the sidebar
     * @param collapsed - Whether the sidebar should be collapsed
     */
    public setSidebarCollapsed(collapsed: boolean): void {
        this.isSidebarCollapsed = collapsed;
        this.sidebarState.next(collapsed);
    }

    // Alias for backward compatibility
    public get collapseSidebar(): boolean {
        return this.isSidebarCollapsed;
    }

    public set collapseSidebar(value: boolean) {
        this.setSidebarCollapsed(value);
    }
}
