import {Component, Input} from '@angular/core';
import { ActivityLog } from './activity-log/activity-log.model';
import {ActivityLogComponent} from "./activity-log/activity-log.component";
import {AuditComponent} from "./audit/audit.component";
import {FraudCaseComponent} from "./fraud-case/fraud-case.component";
import {Audit} from "./audit/audit.model";

@Component({
  selector: 'app-audit-page',
  templateUrl: './audit-page.component.html',
  standalone: true,
  imports: [
    ActivityLogComponent,
    AuditComponent,
    FraudCaseComponent
  ],
})
export class AuditPageComponent {
  selectedLogs: ActivityLog[] = [];
  selectedAudit: Audit | null = null;

  onActivitySelectionChanged(logs: ActivityLog[]) {
    this.selectedLogs = logs;
  }
  onAuditSelectionChanged(audit: Audit) {
    this.selectedAudit = audit;
  }
}
