import { Component, Input } from '@angular/core';
import { NotificationService } from '../Notification.service';
import { AppNotification } from '../Notification.model';
import {NgForOf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../material.module"; // Adjust path as needed

@Component({
  selector: 'app-custom-notification',
  templateUrl: './custom-notification.component.html',
  styleUrls: ['./custom-notification.component.css'],
  imports: [
    NgForOf,
    MatIconModule,
    MaterialModule
  ],
  standalone: true
})
export class CustomNotificationComponent {
  @Input() notifications: AppNotification[] = [];  // Specify the correct type

  constructor(private notificationService: NotificationService) {}

  markAsSeen(id: number): void {
    this.notificationService.markAsSeen(id).subscribe(() => {
      // Remove from the list or re-fetch notifications
      this.notifications = this.notifications.filter((n) => n.id !== id);
    });
  }
}
