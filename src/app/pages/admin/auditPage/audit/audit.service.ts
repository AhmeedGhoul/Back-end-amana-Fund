import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Audit } from './audit.model';
import { PagedResponse } from '../../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = '/api/v1/audit';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllAudits(page: number, size: number): Observable<PagedResponse<Audit>> {
    return this.http.get<PagedResponse<Audit>>(
      `${this.apiUrl}/Audit?page=${page}&size=${size}`,
      { headers: this.getAuthHeaders() }
    );
  }
  detectSuspiciousActivity(auditId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/detect-suspicious-activity/${auditId}`, { responseType: 'text',headers: this.getAuthHeaders() });
  }

searchAudits(filters: any, page: number, size: number): Observable<PagedResponse<Audit>> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (filters.dateAudit && !isNaN(Date.parse(filters.dateAudit))) {
  params = params.set('dateAudit', filters.dateAudit);
}
  if (filters.startDate) params = params.set('startDate', filters.startDate);
  if (filters.endDate) params = params.set('endDate', filters.endDate);
if (filters.statusAudit) params = params.set('statusAudit', filters.statusAudit);
if (filters.output) params = params.set('output', filters.output);
if (filters.reviewedDate && !isNaN(Date.parse(filters.reviewedDate))) {
  params = params.set('reviewedDate', filters.reviewedDate);
}
if (filters.auditType) params = params.set('auditType', filters.auditType);
if (filters.sortBy) filters.sortBy.forEach((sort: string) => params = params.append('sortBy', sort));

return this.http.get<PagedResponse<Audit>>(`${this.apiUrl}/search`, { params, headers });
}


  createAudit(audit: any): Observable<Audit> {
    return this.http.post<Audit>(`${this.apiUrl}/CreateAudit`, audit, {
      headers: this.getAuthHeaders()
    });
  }


  updateAudit(audit: Audit): Observable<Audit> {
    return this.http.put<Audit>(
      `${this.apiUrl}/ModifyAudit`,
      audit,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteAudit(audit: Audit): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAudit/${audit.idAudit}`, {
      headers: this.getAuthHeaders()
    });
  }

  generateAuditReport(directoryPath?: string, fileName?: string): Observable<void> {
    let params = new HttpParams();
    if (directoryPath) params = params.set('directoryPath', directoryPath);
    if (fileName) params = params.set('fileName', fileName);

    return this.http.get<void>(
      `${this.apiUrl}/generateAuditReport`,
      { headers: this.getAuthHeaders(), params }
    );
  }
    getTotalAudits(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/totalAudits`, { headers: this.getAuthHeaders() });
    }

    getAuditsWithFraudCases(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/auditsWithFraudCases`, { headers: this.getAuthHeaders() });
    }
}
