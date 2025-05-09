import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FraudCase } from './fraud-case.model';
import { PagedResponse } from '../../user/user.model'; // réutilise ton modèle existant

@Injectable({ providedIn: 'root' })
export class FraudCaseService {
  private apiUrl = '/api/v1/case';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllCases(page: number, size: number): Observable<PagedResponse<FraudCase>> {
    return this.http.get<PagedResponse<FraudCase>>(`${this.apiUrl}/Case?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders()
    });
  }

  searchCases(filters: any, page: number, size: number): Observable<PagedResponse<FraudCase>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.caseType) params = params.set('caseType', filters.caseType);
    if (filters.caseStatus) params = params.set('caseStatus', filters.caseStatus);
    if (filters.detectionDateTime) params = params.set('detectionDateTime', filters.detectionDateTime);
    if (filters.auditId) params = params.set('auditId', filters.auditId);

    return this.http.get<PagedResponse<FraudCase>>(`${this.apiUrl}/search`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  createCase(fraudCase: FraudCase): Observable<FraudCase> {
    return this.http.post<FraudCase>(`${this.apiUrl}/CreateCase`, fraudCase, {
      headers: this.getAuthHeaders()
    });
  }

  updateCase(fraudCase: FraudCase): Observable<FraudCase> {
    return this.http.put<FraudCase>(`${this.apiUrl}/ModifyCase`, fraudCase, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCase(fraudCase: FraudCase): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteCase/${fraudCase.id_Fraud}`, {
      headers: this.getAuthHeaders()
    });
  }

  generateReport(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/generateFraudCaseReport`, {
      headers: this.getAuthHeaders()
    });
  }
}
