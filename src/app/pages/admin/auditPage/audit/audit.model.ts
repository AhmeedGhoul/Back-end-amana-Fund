import {ActivityLog} from "../activity-log/activity-log.model";

export interface Audit {
  idAudit: number;
  dateAudit: string;
  statusAudit: string;
  output: string;
  reviewedDate: string;
  auditType: string;
  activityLogs?: ActivityLog[];
}
