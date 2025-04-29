import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLog } from './activity-log.model';
import { PagedResponse } from '../../user/user.model';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private apiUrl = '/api/v1/ActivityLog';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllLogs(page: number, size: number): Observable<PagedResponse<ActivityLog>> {
    return this.http.get<PagedResponse<ActivityLog>>(`${this.apiUrl}/ActivityLog?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders()
    });
  }

  searchLogs(filters: any, page: number, size: number): Observable<PagedResponse<ActivityLog>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.activityName) params = params.set('activityName', filters.activityName);
    if (filters.activityDescription) params = params.set('activityDescription', filters.activityDescription);
    if (filters.activityDate) params = params.set('activityDate', filters.activityDate);
    if (filters.userId) params = params.set('userId', filters.userId);
    if (filters.auditId) params = params.set('auditId', filters.auditId);

    return this.http.get<PagedResponse<ActivityLog>>(`${this.apiUrl}/search`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  generateReport(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/generateActivityLogReport`, {
      headers: this.getAuthHeaders()
    });
  }
}
