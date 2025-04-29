import { Component } from '@angular/core';
import { ActivityLog } from './activity-log/activity-log.model';
import {ActivityLogComponent} from "./activity-log/activity-log.component";
import {AuditComponent} from "./audit/audit.component";

@Component({
  selector: 'app-audit-page',
  templateUrl: './audit-page.component.html',
  standalone: true,
  imports: [
    ActivityLogComponent,
    AuditComponent
  ],
})
export class AuditPageComponent {
  selectedLogs: ActivityLog[] = [];

  onActivitySelectionChanged(logs: ActivityLog[]) {
    this.selectedLogs = logs;
  }
}
