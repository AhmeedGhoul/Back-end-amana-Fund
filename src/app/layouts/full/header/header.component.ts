import { AuthService } from '../../../pages/authentication/side-login/login-choice/auth.service'; // Adjust the path to your AuthService

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
import {AppNotification} from "../../../notification/Notification.model";
import {NotificationService} from "../../../notification/Notification.service";
import {CustomNotificationComponent} from "../../../notification/custom-notification/custom-notification.component";
import { MatMenuModule } from '@angular/material/menu';  // Import MatMenuModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule,MatMenuModule, CustomNotificationComponent],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  notifications: AppNotification[] = [];
  unseenCount: number = 0;

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  constructor(private notificationService:  NotificationService,private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Get the notifications on initialization
    this.loadNotifications();
  }
  loadNotifications(): void {
    this.notificationService.getUnseen().subscribe(notifications => {
      this.notifications = notifications;
      this.unseenCount = notifications.length;
    });
  }
  markAsSeen(id: number): void {
    this.notificationService.markAsSeen(id).subscribe(() => {
      this.loadNotifications(); // Reload notifications
    });
  }
  logout() {
    this.authService.logout(); // Clear token
    this.router.navigate(['']); // Redirect to login page
  }

  goToProfile() {
    this.router.navigate(['/admin/profile']);
  }
}

