export interface ActivityLog {
  activityId: number;
  activityName: string;
  activityDescription: string;
  activityDate: string; // ISO format date string (e.g., '2025-04-29T13:45:00Z')
  user?: {
    id: number;
    name: string;
    email: string;
  };
  audit?: {
    idAudit: number;
    output: string;
  };
  ipAddress?: string;
  country?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}
